"use client";
// Sự kiện sắp tới trên trang chủ: sự kiện gần nhất hiện đầy đủ, các sự kiện còn lại (tối đa 5 tất cả) mở ra khi bấm "Xem thêm".
// Bấm ảnh hoặc tên sự kiện sẽ sang trang Sự kiện.
import Link from "next/link";
import { useState } from "react";
import Desc from "./Desc";
import EventPhotos from "./EventPhotos";
import EventRsvp from "./EventRsvp";
import type { Lang } from "@/lib/content";
import { DICT } from "@/lib/i18n";
import { fmt12, fmtDate } from "@/lib/time";

export type HomeEvent = { id: string; title: string; date: string; start: string; end: string; price: string; desc: string; images: string[]; rsvp: boolean };
type Contact = { phone: string; handle: string; instagram: string; address: string };

function Card({ e, lang, c, big }: { e: HomeEvent; lang: Lang; c: Contact; big?: boolean }) {
  const href = `/${lang}/events`;
  return (
    <article className={big ? "" : "grid gap-5 grid-cols-1 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] items-start"}>
      <EventPhotos images={e.images} alt={e.title} href={href} aspect={big ? "aspect-[6/5]" : "aspect-[3/2]"}
        sizes={big ? "(min-width:768px) 720px, 100vw" : "(min-width:640px) 240px, 100vw"} />
      {/* Điện thoại: ngày cạnh tên, mô tả và nút giữ chỗ trải hết bề ngang bên dưới. */}
      <div className={`grid grid-cols-[3rem_minmax(0,1fr)] gap-x-4 md:gap-x-6 min-w-0 ${big ? "mt-6" : ""}`}>
        <div className="text-center">
          <p className={`serif display leading-none ${big ? "text-5xl md:text-6xl" : "text-4xl"}`}>{e.date.slice(8)}</p>
          <p className="eyebrow mt-2">{fmtDate(e.date, "en", { month: "short" })}</p>
        </div>
        <div className="min-w-0">
          <h3 className={`serif break-words leading-tight ${big ? "text-[1.65rem] md:text-3xl" : "text-2xl"}`}><Link href={href} className="hover:underline underline-offset-4">{e.title}</Link></h3>
          <p className="text-sm text-fg/85 mt-2 flex flex-wrap items-center gap-3">{fmt12(e.start)}–{fmt12(e.end)}{e.price && <span className="chip">{e.price}</span>}</p>
        </div>
        <div className="col-span-2 min-w-0">
          <Desc text={e.desc} lang={lang} lines={big ? 4 : 3} className={`text-fg/80 mt-3 ${big ? "text-base" : "text-sm"}`} />
          {e.rsvp && <div className="mt-5"><EventRsvp lang={lang} phone={c.phone} handle={c.handle} instagram={c.instagram} address={c.address} ev={{ id: e.id, title: e.title, date: e.date, start: e.start, end: e.end }} /></div>}
        </div>
      </div>
    </article>
  );
}

export default function EventStack({ events, lang, contact }: { events: HomeEvent[]; lang: Lang; contact: Contact }) {
  const t = DICT[lang];
  const [open, setOpen] = useState(false);
  const [first, ...rest] = events;
  if (!first) return null;
  return (
    <div>
      <Card e={first} lang={lang} c={contact} big />
      {rest.length > 0 && (
        <>
          {open && <div className="mt-10 space-y-10 border-t border-line pt-10">{rest.map((e) => <Card key={e.id} e={e} lang={lang} c={contact} />)}</div>}
          <button type="button" className="link text-sm mt-8" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? t.showLess : `${t.showMore} (${rest.length})`}</button>
        </>
      )}
    </div>
  );
}
