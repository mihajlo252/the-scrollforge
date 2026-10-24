import { AreaField, FieldGroup, ListRow, SelectField, TextField } from "./Fields";
import { roman, uid, listOps } from "./actHelpers";
import styles from "./Acts.module.css";

// A choice the party faces, and the paths out of it. Each path can point at
// another act so the GM can jump there during play.
export const OptionFields = ({
	module,
	onChange,
	acts,
	actID,
}: {
	module: OptionModule;
	onChange: (m: OptionModule) => void;
	acts: CampaignAct[];
	actID: string;
}) => {
	const choices = listOps(module.choices, (choices) => onChange({ ...module, choices }));

	return (
		<>
			<TextField
				label="The choice"
				value={module.prompt}
				placeholder="The bandits flee into the forest. What do the heroes do?"
				onChange={(prompt) => onChange({ ...module, prompt })}
			/>
			<FieldGroup title="Paths" addLabel="Add path" onAdd={() => choices.add({ id: uid(), label: "", notes: "", leadsTo: null })}>
				{module.choices.length === 0 && <p className={styles.groupEmpty}>Add the paths you expect the party might take.</p>}
				{module.choices.map((c, i) => (
					<ListRow
						key={c.id}
						removeLabel="Remove path"
						onRemove={() => choices.remove(i)}
						onMoveUp={i > 0 ? () => choices.move(i, -1) : undefined}
						onMoveDown={i < module.choices.length - 1 ? () => choices.move(i, 1) : undefined}
					>
						<div className={styles.row2}>
							<TextField label={`Path ${i + 1}`} value={c.label} placeholder="Chase the bandits" onChange={(label) => choices.update(i, { label })} />
							<SelectField label="Leads to" value={c.leadsTo ?? ""} onChange={(v) => choices.update(i, { leadsTo: v || null })}>
								<option value="">Nowhere yet</option>
								{acts.map((a, n) =>
									a.id === actID ? null : (
										<option key={a.id} value={a.id}>
											Act {roman(n + 1)} · {a.title}
										</option>
									),
								)}
							</SelectField>
						</div>
						<AreaField
							label="Notes"
							optional
							rows={2}
							value={c.notes}
							placeholder="What happens, what they find, what it costs."
							onChange={(notes) => choices.update(i, { notes })}
						/>
					</ListRow>
				))}
			</FieldGroup>
		</>
	);
};
