import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  adminAddMedia,
  adminListContent,
  adminSaveFaq,
  adminSaveMedia,
  adminSaveNav,
  adminSavePolicy,
  adminSaveSection,
  adminSaveSettings,
} from "@/lib/server/admin";
import type { JsonRow } from "@/lib/types";

export const Route = createFileRoute("/admin/content")({
  component: AdminContent,
});

function AdminContent() {
  const [data, setData] = useState<Awaited<ReturnType<typeof adminListContent>> | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaAlt, setMediaAlt] = useState("");

  async function reload() {
    setData(await adminListContent());
  }

  useEffect(() => {
    reload().catch(() => setData(null));
  }, []);

  if (!data) return <main className="p-6 font-mono text-sm text-mist">LOADING CONTENT</main>;
  const settings = data.settings;

  return (
    <main className="mx-auto max-w-4xl space-y-12 px-4 py-8">
      <h1 className="cour-display text-3xl">CONTENT.</h1>
      {note ? <p className="text-sm text-mist">{note}</p> : null}

      {settings ? (
        <SettingsBlock
          settings={settings}
          onSave={async (payload) => {
            await adminSaveSettings({ data: payload });
            setNote("Settings saved.");
            await reload();
          }}
        />
      ) : null}

      <section>
        <h2 className="font-mono text-[0.7rem] tracking-[0.16em] text-mist">HOMEPAGE</h2>
        <div className="mt-3 space-y-4">
          {data.sections.map((row) => (
            <SectionBlock
              key={String(row.id)}
              row={row}
              onSave={async (payload) => {
                await adminSaveSection({ data: payload });
                setNote("Section saved.");
                await reload();
              }}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-mono text-[0.7rem] tracking-[0.16em] text-mist">NAVIGATION</h2>
        <div className="mt-3 space-y-3">
          {data.navigation.map((row) => (
            <NavBlock
              key={String(row.id)}
              row={row}
              onSave={async (payload) => {
                await adminSaveNav({ data: payload });
                setNote("Navigation saved.");
                await reload();
              }}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-mono text-[0.7rem] tracking-[0.16em] text-mist">FAQS</h2>
        <div className="mt-3 space-y-3">
          {data.faqs.map((row) => (
            <FaqBlock
              key={String(row.id)}
              row={row}
              onSave={async (payload) => {
                await adminSaveFaq({ data: payload });
                setNote("FAQ saved.");
                await reload();
              }}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-mono text-[0.7rem] tracking-[0.16em] text-mist">POLICIES</h2>
        <div className="mt-3 space-y-3">
          {data.policies.map((row) => (
            <PolicyBlock
              key={String(row.id)}
              row={row}
              onSave={async (payload) => {
                await adminSavePolicy({ data: payload });
                setNote("Policy saved.");
                await reload();
              }}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-mono text-[0.7rem] tracking-[0.16em] text-mist">MEDIA</h2>
        <form
          className="mt-3 flex flex-wrap gap-2"
          onSubmit={async (e) => {
            e.preventDefault();
            await adminAddMedia({ data: { url: mediaUrl, altText: mediaAlt } });
            setMediaUrl("");
            setMediaAlt("");
            setNote("Media added.");
            await reload();
          }}
        >
          <input
            className="cour-field max-w-sm"
            placeholder="IMAGE URL"
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
          />
          <input
            className="cour-field max-w-sm"
            placeholder="ALT TEXT"
            value={mediaAlt}
            onChange={(e) => setMediaAlt(e.target.value)}
          />
          <button className="cour-btn" type="submit">
            ADD
          </button>
        </form>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {data.media.map((row) => (
            <MediaBlock
              key={String(row.id)}
              row={row}
              onSave={async (payload) => {
                await adminSaveMedia({ data: payload });
                setNote("Media saved.");
                await reload();
              }}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-mono text-[0.7rem] tracking-[0.16em] text-mist">INQUIRIES</h2>
        <div className="mt-3 divide-y divide-line border border-line">
          {data.inquiries.map((row) => (
            <p key={String(row.id)} className="p-3 font-mono text-sm">
              {String(row.email)} — {String(row.kind)}
            </p>
          ))}
          {data.inquiries.length === 0 ? (
            <p className="p-3 text-sm text-mist">No inquiries yet.</p>
          ) : null}
        </div>
      </section>
    </main>
  );
}

function SettingsBlock({
  settings,
  onSave,
}: {
  settings: JsonRow;
  onSave: (payload: {
    brandName: string;
    tagline?: string;
    contactEmail?: string;
    announcement?: string;
    announcementEnabled: boolean;
    footerNote?: string;
    shippingNote?: string;
    socialInstagram?: string;
    socialX?: string;
  }) => Promise<void>;
}) {
  const [form, setForm] = useState({
    brandName: String(settings.brand_name ?? "COUR"),
    tagline: String(settings.tagline ?? ""),
    contactEmail: String(settings.contact_email ?? ""),
    announcement: String(settings.announcement ?? ""),
    announcementEnabled: Boolean(settings.announcement_enabled),
    footerNote: String(settings.footer_note ?? ""),
    shippingNote: String(settings.shipping_note ?? ""),
    socialInstagram: String(settings.social_instagram ?? ""),
    socialX: String(settings.social_x ?? ""),
  });
  return (
    <form
      className="space-y-2"
      onSubmit={async (e) => {
        e.preventDefault();
        await onSave(form);
      }}
    >
      <h2 className="font-mono text-[0.7rem] tracking-[0.16em] text-mist">SITE SETTINGS</h2>
      {Object.entries(form).map(([key, value]) =>
        key === "announcementEnabled" ? (
          <label key={key} className="flex items-center gap-2 font-mono text-[0.7rem]">
            <input
              type="checkbox"
              checked={form.announcementEnabled}
              onChange={(e) => setForm({ ...form, announcementEnabled: e.target.checked })}
            />
            ANNOUNCEMENT ENABLED
          </label>
        ) : (
          <label key={key} className="block">
            <span className="cour-label">{key}</span>
            <input
              className="cour-field mt-1"
              value={String(value)}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
          </label>
        ),
      )}
      <button className="cour-btn" type="submit">
        SAVE SETTINGS
      </button>
    </form>
  );
}

function SectionBlock({
  row,
  onSave,
}: {
  row: JsonRow;
  onSave: (payload: {
    id: string;
    title?: string;
    body?: string;
    ctaLabel?: string;
    ctaHref?: string;
    enabled: boolean;
    content?: string;
  }) => Promise<void>;
}) {
  const [form, setForm] = useState({
    id: String(row.id),
    title: String(row.title ?? ""),
    body: String(row.body ?? ""),
    ctaLabel: String(row.cta_label ?? ""),
    ctaHref: String(row.cta_href ?? ""),
    enabled: Boolean(row.enabled),
    content: String(row.content ?? "{}"),
  });
  return (
    <form
      className="space-y-2 border border-line p-3"
      onSubmit={async (e) => {
        e.preventDefault();
        await onSave(form);
      }}
    >
      <p className="font-mono text-[0.62rem] tracking-[0.16em] text-dim">{String(row.section_key)}</p>
      <input
        className="cour-field"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        placeholder="TITLE"
      />
      <textarea
        className="cour-field min-h-20"
        value={form.body}
        onChange={(e) => setForm({ ...form, body: e.target.value })}
      />
      <input
        className="cour-field"
        value={form.ctaLabel}
        onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })}
        placeholder="CTA LABEL"
      />
      <input
        className="cour-field"
        value={form.ctaHref}
        onChange={(e) => setForm({ ...form, ctaHref: e.target.value })}
        placeholder="CTA HREF"
      />
      <textarea
        className="cour-field min-h-24 font-mono text-xs"
        value={form.content}
        onChange={(e) => setForm({ ...form, content: e.target.value })}
      />
      <label className="flex items-center gap-2 font-mono text-[0.7rem]">
        <input
          type="checkbox"
          checked={form.enabled}
          onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
        />
        ENABLED
      </label>
      <button className="cour-btn" type="submit">
        SAVE SECTION
      </button>
    </form>
  );
}

function NavBlock({
  row,
  onSave,
}: {
  row: JsonRow;
  onSave: (payload: { id: string; label: string; href: string; visible: boolean }) => Promise<void>;
}) {
  const [form, setForm] = useState({
    id: String(row.id),
    label: String(row.label),
    href: String(row.href),
    visible: Boolean(row.visible),
  });
  return (
    <form
      className="flex flex-wrap items-center gap-2"
      onSubmit={async (e) => {
        e.preventDefault();
        await onSave(form);
      }}
    >
      <input
        className="cour-field max-w-40"
        value={form.label}
        onChange={(e) => setForm({ ...form, label: e.target.value })}
      />
      <input
        className="cour-field max-w-56"
        value={form.href}
        onChange={(e) => setForm({ ...form, href: e.target.value })}
      />
      <label className="font-mono text-[0.62rem]">
        <input
          type="checkbox"
          checked={form.visible}
          onChange={(e) => setForm({ ...form, visible: e.target.checked })}
        />{" "}
        VISIBLE
      </label>
      <button className="cour-btn h-9 min-h-9" type="submit">
        SAVE
      </button>
    </form>
  );
}

function FaqBlock({
  row,
  onSave,
}: {
  row: JsonRow;
  onSave: (payload: {
    id: string;
    question: string;
    answer: string;
    published: boolean;
  }) => Promise<void>;
}) {
  const [form, setForm] = useState({
    id: String(row.id),
    question: String(row.question),
    answer: String(row.answer),
    published: Boolean(row.published),
  });
  return (
    <form
      className="space-y-2 border border-line p-3"
      onSubmit={async (e) => {
        e.preventDefault();
        await onSave(form);
      }}
    >
      <input
        className="cour-field"
        value={form.question}
        onChange={(e) => setForm({ ...form, question: e.target.value })}
      />
      <textarea
        className="cour-field min-h-20"
        value={form.answer}
        onChange={(e) => setForm({ ...form, answer: e.target.value })}
      />
      <button className="cour-btn" type="submit">
        SAVE FAQ
      </button>
    </form>
  );
}

function PolicyBlock({
  row,
  onSave,
}: {
  row: JsonRow;
  onSave: (payload: { id: string; title: string; body: string; published: boolean }) => Promise<void>;
}) {
  const [form, setForm] = useState({
    id: String(row.id),
    title: String(row.title),
    body: String(row.body),
    published: Boolean(row.published),
  });
  return (
    <form
      className="space-y-2 border border-line p-3"
      onSubmit={async (e) => {
        e.preventDefault();
        await onSave(form);
      }}
    >
      <input
        className="cour-field"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <textarea
        className="cour-field min-h-24"
        value={form.body}
        onChange={(e) => setForm({ ...form, body: e.target.value })}
      />
      <button className="cour-btn" type="submit">
        SAVE POLICY
      </button>
    </form>
  );
}

function MediaBlock({
  row,
  onSave,
}: {
  row: JsonRow;
  onSave: (payload: { id: string; url: string; altText: string }) => Promise<void>;
}) {
  const [form, setForm] = useState({
    id: String(row.id),
    url: String(row.url),
    altText: String(row.alt_text ?? ""),
  });
  return (
    <form
      className="space-y-2 border border-line p-3"
      onSubmit={async (e) => {
        e.preventDefault();
        await onSave(form);
      }}
    >
      <img src={form.url} alt={form.altText} className="h-28 w-full object-contain bg-void" />
      <input
        className="cour-field"
        value={form.url}
        onChange={(e) => setForm({ ...form, url: e.target.value })}
      />
      <input
        className="cour-field"
        value={form.altText}
        onChange={(e) => setForm({ ...form, altText: e.target.value })}
      />
      <button className="cour-btn" type="submit">
        SAVE MEDIA
      </button>
    </form>
  );
}
