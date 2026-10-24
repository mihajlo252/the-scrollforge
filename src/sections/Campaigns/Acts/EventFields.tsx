import { useId } from "react";
import { AreaField, FieldGroup, ListRow, NumField, TextField } from "./Fields";
import { listOps, toNum, uid } from "./actHelpers";
import campaignStyles from "../../../routeStyles/campaigns.module.css";
import styles from "./Acts.module.css";

// Something that happens: what sets it off, what happens, how it can turn out,
// and an optional countdown the GM ticks down at the table.
export const EventFields = ({ module, onChange }: { module: EventModule; onChange: (m: EventModule) => void }) => {
	const outcomes = listOps(module.outcomes, (outcomes) => onChange({ ...module, outcomes }));
	const countdownId = useId();
	const cd = module.countdown;

	return (
		<>
			<TextField label="Title" value={module.title} placeholder="The Bridge Gives Way" onChange={(title) => onChange({ ...module, title })} />
			<TextField
				label="Trigger"
				optional
				value={module.trigger}
				placeholder="When the third hero steps onto the bridge"
				onChange={(trigger) => onChange({ ...module, trigger })}
			/>
			<AreaField
				label="What happens"
				optional
				rows={3}
				value={module.happens}
				placeholder="Ropes snap one by one. The bridge sags toward the gorge."
				onChange={(happens) => onChange({ ...module, happens })}
			/>
			<FieldGroup title="Outcomes" addLabel="Add outcome" onAdd={() => outcomes.add({ id: uid(), label: "", text: "" })}>
				{module.outcomes.length === 0 && <p className={styles.groupEmpty}>How might it turn out?</p>}
				{module.outcomes.map((o, i) => (
					<ListRow
						key={o.id}
						removeLabel="Remove outcome"
						onRemove={() => outcomes.remove(i)}
						onMoveUp={i > 0 ? () => outcomes.move(i, -1) : undefined}
						onMoveDown={i < module.outcomes.length - 1 ? () => outcomes.move(i, 1) : undefined}
					>
						<TextField label="If…" value={o.label} placeholder="They cut the ropes first" onChange={(label) => outcomes.update(i, { label })} />
						<AreaField label="Then" rows={2} value={o.text} onChange={(text) => outcomes.update(i, { text })} />
					</ListRow>
				))}
			</FieldGroup>
			<FieldGroup title="Countdown">
				<label className={styles.check} htmlFor={countdownId}>
					<input
						id={countdownId}
						type="checkbox"
						checked={!!cd}
						onChange={(e) => onChange({ ...module, countdown: e.target.checked ? { label: "", start: 4, current: 4 } : null })}
					/>
					Use a countdown
				</label>
				{cd && (
					<div className={styles.row2}>
						<TextField
							label="When it runs out"
							value={cd.label}
							placeholder="The bridge collapses"
							onChange={(label) => onChange({ ...module, countdown: { ...cd, label } })}
						/>
						<NumField
							label="Start at"
							value={cd.start}
							min={1}
							max={20}
							onChange={(v) => {
								const start = Math.max(0, Math.min(20, toNum(v) ?? 0));
								// Changing the length restarts the countdown.
								onChange({ ...module, countdown: { ...cd, start, current: start } });
							}}
						/>
					</div>
				)}
				{cd && <span className={campaignStyles.fieldHint}>Tick it down from the event's card during play.</span>}
			</FieldGroup>
			<AreaField label="GM notes" optional rows={2} value={module.notes} onChange={(notes) => onChange({ ...module, notes })} />
		</>
	);
};
