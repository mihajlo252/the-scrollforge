import { PDFDocument, PDFFont, PDFPage, StandardFonts, rgb } from "pdf-lib";
import { gearModifiers } from "./daggerheart";

/* Fills the official Darrington Press character sheet (public/daggerheart-sheets.pdf)
 * with a character's data and offers it as a download. The source PDF has no form
 * fields, so values are drawn at fixed coordinates; every class front page shares
 * the same layout, so one coordinate map serves them all. Trackers (HP, Stress,
 * Hope, armor slots, gold) are intentionally left blank for pencil use. */

const PAGE_H = 792;

/** Source-PDF page indices per class: the fillable front + static guide pages. */
const CLASS_PAGES: Record<string, { front: number; extras: number[] }> = {
	bard: { front: 0, extras: [1] },
	druid: { front: 2, extras: [3, 4, 5] },
	guardian: { front: 6, extras: [7] },
	ranger: { front: 8, extras: [9, 10] },
	rogue: { front: 11, extras: [12] },
	seraph: { front: 13, extras: [14] },
	sorcerer: { front: 15, extras: [16] },
	warrior: { front: 17, extras: [18] },
	wizard: { front: 19, extras: [20] },
};
const BLANK_SHEET_PAGE = 21;

const TRAIT_ORDER: { key: DHTraitName; x: number }[] = [
	{ key: "Agility", x: 226 },
	{ key: "Strength", x: 296 },
	{ key: "Finesse", x: 361 },
	{ key: "Instinct", x: 428 },
	{ key: "Presence", x: 496 },
	{ key: "Knowledge", x: 563 },
];

const ink = rgb(0.13, 0.12, 0.11);

const fmtMod = (n: number) => (n > 0 ? `+${n}` : String(n));

/** Helvetica (WinAnsi) can't encode every glyph app data may hold — swap the
 *  usual offenders and drop anything else it would throw on. */
const sanitize = (text: string) =>
	text
		.replace(/−/g, "-")
		.replace(/[-—]/g, "-")
		.replace(/[“”]/g, '"')
		.replace(/‘|’/g, "'")
		.replace(/[^\x20-\x7e\xa0-\xff]/g, "");

type Ctx = { page: PDFPage; font: PDFFont; bold: PDFFont };

/** Draw text at top-left-origin coordinates (the map below was measured from a
 *  top-left render), shrinking to fit maxWidth when given. */
const draw = (
	ctx: Ctx,
	text: string,
	opts: { x: number; y: number; size: number; bold?: boolean; maxWidth?: number; center?: boolean },
) => {
	const value = sanitize(text).trim();
	if (!value) return;
	const font = opts.bold ? ctx.bold : ctx.font;
	let size = opts.size;
	if (opts.maxWidth) {
		while (size > 5 && font.widthOfTextAtSize(value, size) > opts.maxWidth) size -= 0.5;
	}
	let x = opts.x;
	if (opts.center) x -= font.widthOfTextAtSize(value, size) / 2;
	ctx.page.drawText(value, { x, y: PAGE_H - opts.y, size, font, color: ink });
};

const wrapText = (font: PDFFont, text: string, size: number, maxWidth: number): string[] => {
	const words = sanitize(text).split(/\s+/).filter(Boolean);
	const lines: string[] = [];
	let line = "";
	for (const word of words) {
		const candidate = line ? `${line} ${word}` : word;
		if (font.widthOfTextAtSize(candidate, size) <= maxWidth) line = candidate;
		else {
			if (line) lines.push(line);
			line = word;
		}
	}
	if (line) lines.push(line);
	return lines;
};

/** Weapon/armor FEATURE rows: a short first line beside the label + a full-width
 *  second line; anything longer is ellipsised. */
const drawFeature = (ctx: Ctx, text: string, firstLineY: number) => {
	const size = 7;
	const seg1 = 262;
	const seg2 = 282;
	const lines = wrapText(ctx.font, text, size, seg1);
	const rest = lines.slice(1).join(" ");
	const restLines = rest ? wrapText(ctx.font, rest, size, seg2) : [];
	if (restLines.length > 1) restLines[0] = `${restLines[0].slice(0, -3)}...`;
	draw(ctx, lines[0] ?? "", { x: 332, y: firstLineY, size });
	draw(ctx, restLines[0] ?? "", { x: 310, y: firstLineY + 14, size });
};

const drawWeapon = (ctx: Ctx, weapon: DHWeapon | null | undefined, nameY: number) => {
	if (!weapon) return;
	draw(ctx, weapon.name, { x: 293, y: nameY, size: 10, bold: true, maxWidth: 114 });
	draw(ctx, [weapon.trait, weapon.range].filter(Boolean).join(" · "), {
		x: 462, y: nameY, size: 9, center: true, maxWidth: 94,
	});
	draw(ctx, [weapon.damage, weapon.dtype].filter(Boolean).join(" "), {
		x: 553, y: nameY, size: 9, center: true, maxWidth: 80,
	});
	drawFeature(ctx, weapon.feature ?? "", nameY + 38);
};

const fillFrontPage = (ctx: Ctx, character: DaggerheartCharacter, isBlankSheet: boolean) => {
	const profile = character.characterProfile;
	const vitals = character.dhVitals;
	// Same gear-derived overlay the on-screen sheet applies (base + equipped mods).
	const gear = gearModifiers(character.dhWeapons, character.dhArmor);

	// Header strip
	draw(ctx, profile.name ?? "", { x: 241, y: 22, size: 11, bold: true, maxWidth: 152 });
	draw(ctx, [profile.ancestry, profile.community].filter(Boolean).join(" "), {
		x: 238, y: 39, size: 9, maxWidth: 124,
	});
	if (isBlankSheet) {
		// The universal sheet's field is labelled "CLASS & SUBCLASS" (the label
		// runs to x≈435), so the class goes here instead of a printed banner.
		const classAndSub = [profile.class, profile.subclass && `(${profile.subclass})`].filter(Boolean).join(" ");
		draw(ctx, classAndSub, { x: 440, y: 39, size: 9, maxWidth: 90 });
	} else {
		draw(ctx, profile.subclass ?? "", { x: 412, y: 39, size: 9, maxWidth: 118 });
	}
	draw(ctx, String(profile.level || 1), { x: 571, y: 36, size: 18, bold: true, center: true });

	// Traits
	if (character.dhTraits) {
		for (const { key, x } of TRAIT_ORDER) {
			draw(ctx, fmtMod((character.dhTraits[key] ?? 0) + (gear.traits[key] ?? 0)), { x, y: 104, size: 13, bold: true, center: true });
		}
	}

	if (vitals) {
		draw(ctx, String(vitals.evasion + gear.evasion), { x: 40, y: 100, size: 13, bold: true, center: true });
		draw(ctx, String(vitals.armorScore + gear.armorScore), { x: 105, y: 100, size: 13, bold: true, center: true });
		// Damage thresholds: the circles between the Minor/Major/Severe banners.
		draw(ctx, String(vitals.hp.major + gear.thresholds.major), { x: 95, y: 203, size: 11, bold: true, center: true });
		draw(ctx, String(vitals.hp.severe + gear.thresholds.severe), { x: 181, y: 203, size: 11, bold: true, center: true });
		// Proficiency pips (first circle is pre-printed filled).
		const pips = Math.min(vitals.proficiency, 6);
		for (let i = 1; i < pips; i++) {
			ctx.page.drawCircle({ x: 444 + i * 11.45, y: PAGE_H - 177, size: 3.6, color: ink });
		}
	}

	// Experiences (five ruled lines, bonus pentagon at the right end)
	const expLines = [402, 421, 441, 460, 479];
	(character.dhExperiences ?? []).slice(0, 5).forEach((exp, i) => {
		draw(ctx, exp.name, { x: 24, y: expLines[i] - 3, size: 9, maxWidth: 185 });
		draw(ctx, fmtMod(exp.bonus), { x: 236, y: expLines[i] - 2, size: 9, bold: true, center: true });
	});

	// Active weapons + armor
	drawWeapon(ctx, character.dhWeapons?.primary, 208);
	drawWeapon(ctx, character.dhWeapons?.secondary, 302);
	if (character.dhArmor) {
		draw(ctx, character.dhArmor.name, { x: 293, y: 406, size: 10, bold: true, maxWidth: 150 });
		draw(ctx, `${character.dhArmor.thresholds.major} / ${character.dhArmor.thresholds.severe}`, {
			x: 505, y: 406, size: 9, center: true,
		});
		draw(ctx, String(character.dhArmor.score), { x: 570, y: 406, size: 9, center: true });
		drawFeature(ctx, character.dhArmor.feature ?? "", 444);
	}

	// Inventory (five ruled lines; overflow is summarised on the last line)
	const invLines = [503, 522, 541, 561, 580];
	const items = character.dhInventory ?? [];
	items.slice(0, 5).forEach((item, i) => {
		const isLast = i === 4 && items.length > 5;
		const label = isLast
			? `+ ${items.length - 4} more...`
			: `${item.qty > 1 ? `${item.qty}× ` : ""}${item.name}${item.note ? ` — ${item.note}` : ""}`;
		draw(ctx, label, { x: 293, y: invLines[i] - 3, size: 8, maxWidth: 296 });
	});
};

/** Pure fill step (kept separate from the browser download wrapper so it can be
 *  exercised from a Node script). */
export const fillDaggerheartSheet = async (
	srcBytes: ArrayBuffer | Uint8Array,
	character: DaggerheartCharacter,
): Promise<Uint8Array> => {
	const src = await PDFDocument.load(srcBytes);
	const pages = CLASS_PAGES[(character.characterProfile.class ?? "").toLowerCase()] ?? {
		front: BLANK_SHEET_PAGE,
		extras: [],
	};

	const out = await PDFDocument.create();
	const copied = await out.copyPages(src, [pages.front, ...pages.extras]);
	copied.forEach((p) => out.addPage(p));

	const ctx: Ctx = {
		page: copied[0],
		font: await out.embedFont(StandardFonts.Helvetica),
		bold: await out.embedFont(StandardFonts.HelveticaBold),
	};
	fillFrontPage(ctx, character, pages.front === BLANK_SHEET_PAGE);
	return out.save();
};

export const downloadDaggerheartSheet = async (character: DaggerheartCharacter) => {
	const res = await fetch("./daggerheart-sheets.pdf");
	if (!res.ok) throw new Error(`Couldn't load the sheet template (${res.status})`);
	const filled = await fillDaggerheartSheet(await res.arrayBuffer(), character);

	const url = URL.createObjectURL(new Blob([filled as BlobPart], { type: "application/pdf" }));
	const a = document.createElement("a");
	a.href = url;
	a.download = `${(character.characterProfile.name || "hero").replace(/[^\w -]+/g, "").trim() || "hero"}-daggerheart-sheet.pdf`;
	document.body.appendChild(a);
	a.click();
	a.remove();
	URL.revokeObjectURL(url);
};
