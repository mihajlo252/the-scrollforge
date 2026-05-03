export const Icon = ({
	name,
	size = 16,
	stroke = 1.6,
	fillClr,
	strokeClr,
}: {
	name: string;
	size?: any;
	stroke?: any;
	fillClr?: string;
	strokeClr?: string;
}) => {
	const paths: any = {
		dice: (
			<>
				<path d="M12 3l9 5v8l-9 5-9-5V8l9-5z" />
				<path d="M12 12l9-4M12 12v10M12 12L3 8" />
			</>
		),
		plus: (
			<>
				<path d="M12 5v14M5 12h14" />
			</>
		),
		trash: (
			<>
				<path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M6 6l1 14a2 2 0 002 2h6a2 2 0 002-2l1-14" />
			</>
		),
		back: (
			<>
				<path d="M15 6l-6 6 6 6" />
			</>
		),
		fwd: (
			<>
				<path d="M9 6l6 6-6 6" />
			</>
		),
		close: (
			<>
				<path d="M6 6l12 12M18 6L6 18" />
			</>
		),
		edit: (
			<>
				<path d="M12 20h9M16.5 3.5a2.1 2.1 0 113 3L7 19l-4 1 1-4 12.5-12.5z" />
			</>
		),
		heart: (
			<>
				<path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 00-7.8 7.8l1.1 1L12 21l7.7-7.6 1.1-1a5.5 5.5 0 000-7.8z" />
			</>
		),
		shield: (
			<>
				<path d="M12 2l8 3v7c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V5l8-3z" />
			</>
		),
		sword: (
			<>
				<path d="M14.5 17.5L3 6V3h3l11.5 11.5M13 19l6-6M16 16l4 4M19 21l2-2" />
			</>
		),
		sparkle: (
			<>
				<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />
			</>
		),
		scroll: (
			<>
				<path d="M8 3h11a2 2 0 012 2v3a2 2 0 01-2 2H8m0-7a2 2 0 00-2 2v12a2 2 0 002 2h11a2 2 0 002-2v-3M8 3a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h3z" />
			</>
		),
		bag: (
			<>
				<path d="M6 7h12l-1 13a2 2 0 01-2 2H9a2 2 0 01-2-2L6 7zM9 7V5a3 3 0 016 0v2" />
			</>
		),
		book: (
			<>
				<path d="M4 4h6a3 3 0 013 3v13a2 2 0 00-2-2H4V4zM20 4h-6a3 3 0 00-3 3v13a2 2 0 012-2h7V4z" />
			</>
		),
		star: (
			<>
				<path d="M12 2l3 6.9 7.6.7-5.7 5 1.7 7.4L12 18.3 5.4 22l1.7-7.4-5.7-5 7.6-.7L12 2z" />
			</>
		),
		chev_r: (
			<>
				<path d="M9 6l6 6-6 6" />
			</>
		),
		chev_l: (
			<>
				<path d="M15 6l-6 6 6 6" />
			</>
		),
		chev_d: (
			<>
				<path d="M6 9l6 6 6-6" />
			</>
		),
		check: (
			<>
				<path d="M4 12l5 5L20 6" />
			</>
		),
		flame: (
			<>
				<path d="M12 2s4 4 4 8a4 4 0 01-8 0c0-2 1-3 2-4 0 2 1 3 2 3-1-2 0-5 0-7zM7 13a5 5 0 0010 0" />
			</>
		),
		search: (
			<>
				<circle cx="11" cy="11" r="7" />
				<path d="M21 21l-4.3-4.3" />
			</>
		),
		user: (
			<>
				<circle cx="12" cy="8" r="4" />
				<path d="M4 21a8 8 0 0116 0" />
			</>
		),
		bolt: (
			<>
				<path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
			</>
		),
		gear: (
			<>
				<circle cx="12" cy="12" r="3" />
				<path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1A2 2 0 113.3 17l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H2a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1A2 2 0 116 4.3l.1.1a1.7 1.7 0 001.8.3H8a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V8a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" />
			</>
		),
		moon: (
			<>
				<path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" />
			</>
		),
		d20: (
			<>
				<path d="M12 2l9 5.5v9L12 22l-9-5.5v-9L12 2z" />
				<path d="M12 2v20M3 7.5l18 9M21 7.5l-18 9" />
			</>
		),
		eye: (
			<>
				<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
				<circle cx="12" cy="12" r="3" />
			</>
		),
		skull: (
			<>
				<path d="M12 2a8 8 0 00-8 8v5a2 2 0 002 2h1v3h10v-3h1a2 2 0 002-2v-5a8 8 0 00-8-8z" />
				<circle cx="9" cy="11" r="1.3" />
				<circle cx="15" cy="11" r="1.3" />
			</>
		),
		potion: (
			<>
				<path d="M10 2h4v4l3 5a5 5 0 11-10 0l3-5V2z" />
			</>
		),
		hex: (
			<>
				<path d="M12 2l9 5v10l-9 5-9-5V7l9-5z" />
			</>
		),
		rest: (
			<>
				<path d="M3 12h18M3 6h18M3 18h18" />
			</>
		),
		crown: (
			<>
				<path d="M3 19h18M3 9l4 4 5-8 5 8 4-4v10H3V9z" />
			</>
		),
	};
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill={"none"}
			stroke={"currentColor"}
			strokeWidth={stroke}
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			{paths[name]}
		</svg>
	);
};
export const AvatarIcon = ({
	name,
	size = 16,
	stroke = 1.6,
	fillClr,
	strokeClr,
}: {
	name: string;
	size?: any;
	stroke?: any;
	fillClr?: string;
	strokeClr?: string;
}) => {
	const paths: any = {
		cleric: (
			<>
				<path
					d="M566.6001,333.18187h-14.42065l0.08271,14.42064l0.79941,0.56067l0.08907,0.06248c-0.03525,0.04154 -0.0731,0.08249 -0.11347,0.12279c-0.14887,0.14864 -0.33189,0.28854 -0.54445,0.41755c-0.18697,0.11348 -0.39677,0.21855 -0.62627,0.31374c-0.21132,0.08765 -0.70272,0.23612 -0.70272,0.23612c-0.28335,0.08162 -0.56502,0.15082 -0.88338,0.20461c-0.10707,0.01809 -0.2159,0.03451 -0.32633,0.04918c-0.16553,0.02199 -0.33467,0.04006 -0.50692,0.05398c-0.27622,0.02232 -0.56042,0.03395 -0.85053,0.03395c-0.29011,0 -0.57432,-0.01163 -0.85054,-0.03395c-0.17225,-0.01392 -0.34139,-0.03199 -0.50692,-0.05398c-0.43879,-0.0583 -1.0645,-0.2083 -1.0645,-0.2083c-0.24223,-0.06977 -0.63659,-0.19396 -0.84791,-0.28161c-0.2295,-0.09519 -0.62628,-0.31374 -0.62628,-0.31374c0,0 -0.39558,-0.26891 -0.54445,-0.41755c-0.04037,-0.0403 -0.07821,-0.08125 -0.11346,-0.12279l0.08906,-0.06248l0.68414,-0.56067v-14.42064l-14.42829,-0.00537l-0.55302,0.7885l-0.06247,0.08907c-0.04154,-0.03525 -0.0825,-0.0731 -0.1228,-0.11347c-0.14864,-0.14887 -0.28854,-0.33189 -0.41755,-0.54445c-0.11348,-0.18697 -0.21855,-0.39678 -0.31374,-0.62628c-0.08765,-0.21132 -0.23612,-0.70272 -0.23612,-0.70272c-0.08162,-0.28335 -0.15082,-0.56502 -0.20461,-0.88338c-0.01809,-0.10707 -0.03451,-0.21589 -0.04918,-0.32632c-0.02199,-0.16553 -0.04005,-0.33467 -0.05397,-0.50692c-0.02232,-0.27622 -0.03396,-0.56043 -0.03396,-0.85054c0,-0.29011 0.01164,-0.57431 0.03396,-0.85053c0.01392,-0.17225 0.03198,-0.34139 0.05397,-0.50692c0.0583,-0.43879 0.2083,-1.0645 0.2083,-1.0645c0.06977,-0.24223 0.19396,-0.6366 0.28161,-0.84792c0.09519,-0.2295 0.31374,-0.62628 0.31374,-0.62628c0,0 0.26891,-0.39557 0.41755,-0.54444c0.0403,-0.04037 0.08126,-0.07821 0.1228,-0.11346l0.06247,0.08906l0.56067,0.78312h14.42064v-14.42063l-0.68414,-0.56067l-0.08906,-0.06247c0.03525,-0.04154 0.07309,-0.08249 0.11346,-0.12279c0.14887,-0.14864 0.33189,-0.28854 0.54445,-0.41755c0.18697,-0.11348 0.39678,-0.21855 0.62628,-0.31374c0.21132,-0.08765 0.70271,-0.23612 0.70271,-0.23612c0.28335,-0.08162 0.56503,-0.15082 0.88339,-0.20461c0.10707,-0.01809 0.21589,-0.03451 0.32632,-0.04918c0.16553,-0.02199 0.33467,-0.04006 0.50692,-0.05398c0.27622,-0.02232 0.56043,-0.03396 0.85054,-0.03396c0.29011,0 0.57431,0.01164 0.85053,0.03396c0.17225,0.01392 0.34139,0.03199 0.50692,0.05398c0.43879,0.0583 1.0645,0.20829 1.0645,0.20829c0.24223,0.06977 0.6366,0.19397 0.84792,0.28162c0.2295,0.09519 0.62627,0.31374 0.62627,0.31374c0,0 0.39558,0.26891 0.54445,0.41755c0.04037,0.0403 0.07822,0.08125 0.11347,0.12279l-0.08907,0.06247l-0.79941,0.56067l-0.08271,14.42063h14.42065l0.57136,-0.7832l0.0626,-0.08899c0.0415,0.0353 0.08239,0.07321 0.12264,0.11363c0.14845,0.14906 0.28811,0.33227 0.41684,0.545c0.11323,0.18712 0.21802,0.39706 0.31291,0.62669c0.08737,0.21143 0.2352,0.70302 0.2352,0.70302c0.08124,0.28346 0.15007,0.56523 0.20345,0.88366c0.01795,0.10709 0.03421,0.21594 0.04874,0.32639c0.02178,0.16557 0.03963,0.33473 0.05332,0.50699c0.02196,0.27625 0.03321,0.56046 0.03283,0.85057c-0.00038,0.29011 -0.01239,0.5743 -0.03507,0.85049c-0.01414,0.17223 -0.03243,0.34136 -0.05464,0.50685c-0.05887,0.43871 -0.2097,1.06423 -0.2097,1.06423c-0.07009,0.24215 -0.1948,0.63634 -0.28273,0.84754c-0.0955,0.22938 -0.31456,0.62586 -0.31456,0.62586c0,0 -0.26942,0.39523 -0.41826,0.54391c-0.04036,0.04031 -0.08136,0.07811 -0.12295,0.1133l-0.06235,-0.08915z"
					id="Path-1"
				/>
				<path
					d="M556.14553,318.80236l12.51447,-9.45994l-9.45995,12.51447l-0.70701,0.04925l-2.57618,0.17942l0.17942,-2.57618z"
					id="Path-33641-1"
				/>
				<path
					d="M556.01378,340.07072l12.51447,9.45995l-9.45995,-12.51447l-0.70701,-0.04926l-2.57618,-0.17941l0.17943,2.57617z"
					id="Path-34021-1"
				/>
				<path
					d="M540.98139,340.07072l-12.51448,9.45995l9.45995,-12.51447l0.70701,-0.04926l2.57619,-0.17941l-0.17943,2.57617z"
					id="Path-34250-1"
				/>
				<path
					d="M540.85447,318.92928l-12.51447,-9.45995l9.45995,12.51447l0.70701,0.04926l2.57618,0.17941l-0.17942,-2.57617z"
					id="Path-34404-1"
				/>
				<path
					d="M548.5,307.13657c-1.50908,0 -2.95135,0.39285 -4.17142,1.20585c2.49305,-1.66126 4.17142,-4.77528 4.17142,-8.34284c0,3.56756 1.67837,6.68158 4.17142,8.34284c-1.22007,-0.813 -2.66234,-1.20585 -4.17142,-1.20585z"
					id="Path-1-1"
				/>
				<path
					d="M548.5,351.86343c-1.50908,0 -2.95135,-0.39285 -4.17142,-1.20585c2.49305,1.66126 4.17142,4.77528 4.17142,8.34284c0,-3.56756 1.67837,-6.68158 4.17142,-8.34284c-1.22007,0.813 -2.66234,1.20585 -4.17142,1.20585z"
					id="Path-42754-1"
				/>
				<path
					d="M570.86585,329.5c0,1.50908 -0.39285,2.95135 -1.20585,4.17142c1.66126,-2.49305 4.77529,-4.17142 8.34285,-4.17142c-3.56756,0 -6.68159,-1.67837 -8.34285,-4.17142c0.813,1.22007 1.20585,2.66234 1.20585,4.17142z"
					id="Path-44449-1"
				/>
				<path
					d="M526.13415,329.5c0,-1.50908 0.39285,-2.95135 1.20585,-4.17142c-1.66126,2.49305 -4.77529,4.17142 -8.34285,4.17142c3.56756,0 6.68159,1.67837 8.34285,4.17142c-0.813,-1.22007 -1.20585,-2.66234 -1.20585,-4.17142z"
					id="Path-44742-1"
				/>
			</>
		),
	};
	return (
		<svg
			width={size}
			height={size}
			viewBox="516.5 297.5 64 64"
			fill={fillClr || "#FFF"}
			stroke={strokeClr || "currentColor"}
			strokeWidth={stroke}
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			{paths[name]}
		</svg>
	);
};

// Stat pill (large display value + caption)
export const StatPill = ({ label, value, mod, onClick }: { label: string; value: any; mod: any; onClick: any }) => (
	<div className="sf-stat" onClick={onClick}>
		<div className="sf-stat-label caps">{label}</div>
		<div className="sf-stat-value display">{value}</div>
		{mod != null && <div className="sf-stat-mod mono">{mod >= 0 ? `+${mod}` : mod}</div>}
	</div>
);

// Ornate section heading with flanking runes
export const Heading = ({ children, size = 28, align = "left" }: { children: any; size: any; align: any }) => (
	<div className="sf-heading display" style={{ fontSize: size, textAlign: align }}>
		<span className="rune-l">✦</span>
		<span className="txt">{children}</span>
		<span className="rune-r">✦</span>
	</div>
);

// HP Bar
export const HPBar = ({ cur, max, temp = 0 }: { cur: any; max: any; temp: any }) => {
	const pct = Math.max(0, Math.min(100, (cur / max) * 100));
	const tempPct = Math.max(0, Math.min(100, (temp / max) * 100));
	const color = pct > 50 ? "var(--emerald)" : pct > 25 ? "var(--gold)" : "var(--ember)";
	return (
		<div className="sf-hpbar">
			<div className="sf-hpbar-track">
				<div className="sf-hpbar-fill" style={{ width: pct + "%", background: color }} />
				{temp > 0 && <div className="sf-hpbar-temp" style={{ width: tempPct + "%", left: pct + "%" }} />}
			</div>
		</div>
	);
};

// Dot fill (for spell slots, etc.)
export const Dots = ({ total, filled, size = 11, color = "var(--gold)" }: { total?: any; filled?: any; size?: any; color: any }) => (
	<div className="sf-dots">
		{Array.from({ length: total }).map((_, i) => (
			<span
				key={i}
				className="sf-dot"
				data-filled={i < filled ? "" : undefined}
				style={{ width: size, height: size, borderColor: color, background: i < filled ? color : "transparent" }}
			/>
		))}
	</div>
);

// Tab bar
export const TabBar = ({ tabs, active, onChange }: { tabs: any; active: any; onChange: any }) => (
	<div className="sf-tabs">
		{tabs.map((t: any) => (
			<button key={t.id} className="sf-tab" data-active={active === t.id ? "" : undefined} onClick={() => onChange(t.id)}>
				<Icon name={t.icon} size={14} />
				<span>{t.label}</span>
			</button>
		))}
	</div>
);

// Top chrome — app header with character switcher
export const AppChrome = ({ character, onBack, right }: { character: any; onBack: any; right: any }) => (
	<div className="sf-chrome">
		<div className="sf-chrome-l">
			{onBack && (
				<button className="sf-icon-btn" onClick={onBack}>
					<Icon name="back" />
				</button>
			)}
			<div className="logo-scrollforge compact">
				<span className="the caps">THE</span>
				<span className="name display">Scrollforge</span>
			</div>
		</div>
		{character && (
			<div className="sf-chrome-m">
				<div className="sf-avatar-sm" style={{ background: character.color }}>
					{character.initial}
				</div>
				<div>
					<div className="display" style={{ fontSize: 20, lineHeight: 1 }}>
						{character.name}
					</div>
					<div className="caps" style={{ fontSize: 10, marginTop: 4 }}>
						{character.sub}
					</div>
				</div>
				<button className="sf-icon-btn">
					<Icon name="chev_d" size={14} />
				</button>
			</div>
		)}
		<div className="sf-chrome-r">{right}</div>
	</div>
);

export const RuneDivider = () => (
	<div className="rune-divider">
		<span className="rune"></span>
	</div>
);
