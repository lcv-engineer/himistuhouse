"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Logo from "../Logo";
import { ExternalIcon, GearIcon, GlassIcon, ImageIcon, KeyIcon, LogoutIcon, PageIcon, PercentIcon, SparkIcon, TonightIcon } from "../Icons";
import type { Content } from "@/lib/content";
import { EventsSection, GallerySection, MenuSection, PagesSection, PromosSection, SecretsSection, SettingsSection, TonightSection } from "./sections";

const NAV = [
  { id: "", label: "Tối nay", I: TonightIcon },
  { id: "events", label: "Sự kiện", I: SparkIcon },
  { id: "menu", label: "Menu", I: GlassIcon },
  { id: "promotions", label: "Ưu đãi", I: PercentIcon },
  { id: "secrets", label: "Bí mật", I: KeyIcon },
  { id: "pages", label: "Trang", I: PageIcon },
  { id: "gallery", label: "Gallery", I: ImageIcon },
  { id: "settings", label: "Cài đặt", I: GearIcon },
] as const;

export type Save = (next: Content) => Promise<void>;

export default function AdminApp() {
  const path = usePathname() ?? "/admin";
  const router = useRouter();
  const tab = path.replace(/^\/admin\/?/, "").split("/")[0];
  const [auth, setAuth] = useState<"loading" | "no" | "yes">("loading");
  const [content, setContent] = useState<Content | null>(null);
  const [email, setEmail] = useState("");
  const [toast, setToast] = useState("");

  const load = useCallback(() => {
    fetch("/api/admin/content")
      .then(async (r) => {
        if (r.status === 401) return setAuth("no");
        setContent(await r.json());
        setAuth("yes");
        const me = await fetch("/api/admin?me=1").then((x) => x.json());
        setEmail(me.email ?? "");
      })
      .catch(() => setAuth("no"));
  }, []);
  useEffect(load, [load]);

  const flash = useCallback((m: string) => {
    setToast(m);
    setTimeout(() => setToast(""), 2600);
  }, []);

  const save: Save = useCallback(async (next) => {
    const r = await fetch("/api/admin/content", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(next) });
    if (!r.ok) { flash("Lưu thất bại – thử đăng nhập lại."); return; }
    setContent(next);
    flash("Đã lưu · trang web cập nhật trong vài giây");
  }, [flash]);

  async function logout() {
    await fetch("/api/admin", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ logout: true }) });
    router.push("/admin/login");
    setAuth("no");
  }

  if (auth === "loading") return <div className="min-h-screen grid place-items-center text-muted">Đang tải…</div>;
  if (auth === "no" || tab === "login") {
    if (auth === "yes") { router.replace("/admin"); return null; }
    return <Login onDone={() => { router.replace("/admin"); load(); }} />;
  }
  if (!content) return null;

  const body = (() => {
    switch (tab) {
      case "events": return <EventsSection c={content} save={save} />;
      case "menu": return <MenuSection c={content} save={save} />;
      case "promotions": return <PromosSection c={content} save={save} />;
      case "secrets": return <SecretsSection c={content} save={save} />;
      case "pages": return <PagesSection c={content} save={save} />;
      case "gallery": return <GallerySection c={content} save={save} />;
      case "settings": return <SettingsSection c={content} save={save} />;
      default: return <TonightSection c={content} flash={flash} />;
    }
  })();

  return (
    <div className="min-h-screen md:grid md:grid-cols-[200px_1fr] bg-bg2">
      <aside className="md:sticky md:top-0 md:h-screen border-b md:border-b-0 md:border-r border-line bg-bg2 flex md:flex-col p-4 md:p-5 gap-4">
        <div className="flex items-center gap-3 md:mb-6">
          <Logo height={26} />
          <span className="serif text-lg text-fg/85">Quản trị</span>
        </div>
        <nav className="flex md:flex-col gap-1 overflow-x-auto flex-1" aria-label="Quản trị">
          {NAV.map(({ id, label, I }) => {
            const on = tab === id;
            return (
              <Link key={id} href={`/admin${id ? `/${id}` : ""}`} className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium whitespace-nowrap ${on ? "bg-white/[.07]" : "hover:bg-white/[.04]"}`} aria-current={on ? "page" : undefined}>
                <I className="w-4 h-4 opacity-80" />{label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden md:block space-y-3 text-[.8rem]">
          <a href="/en" target="_blank" className="flex items-center gap-2 hover:opacity-70"><ExternalIcon className="w-4 h-4" />Xem trang web</a>
          {email && <p className="font-semibold truncate" title={email}>{email}</p>}
          <button type="button" onClick={logout} className="flex items-center gap-2 hover:opacity-70"><LogoutIcon className="w-4 h-4" />Đăng xuất</button>
        </div>
      </aside>
      <main className="px-4 md:px-6 py-8 md:py-10 min-w-0 bg-bg2">{body}</main>
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}

function Login({ onDone }: { onDone: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr("");
    const r = await fetch("/api/admin", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email, password }) });
    setBusy(false);
    if (r.ok) onDone(); else setErr("Email hoặc mật khẩu không đúng.");
  }
  return (
    <div className="min-h-screen grid place-items-center px-4 bg-bg2">
      <form onSubmit={submit} className="w-full max-w-sm">
        <Logo height={44} />
        <h1 className="serif text-4xl mt-8 mb-8">Quản trị Himitsu</h1>
        <label className="label" htmlFor="ad-email">Email</label>
        <input id="ad-email" type="email" autoComplete="username" className="field" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label className="label mt-5" htmlFor="ad-pass">Mật khẩu</label>
        <input id="ad-pass" type="password" autoComplete="current-password" className="field" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {err && <p className="text-sm text-[#e36b6f] mt-4" role="alert">{err}</p>}
        <button className="btn btn-solid w-full mt-6" disabled={busy}>{busy ? "Đang đăng nhập…" : "Đăng nhập"}</button>
      </form>
    </div>
  );
}
