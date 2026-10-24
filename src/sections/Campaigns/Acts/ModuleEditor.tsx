import React, { useState } from "react";
import { Icon } from "../../../components/Primitives";
import { CampaignModal } from "../CampaignParts";
import { AdversaryFields } from "./AdversaryFields";
import { EncounterFields } from "./EncounterFields";
import { EnvironmentFields } from "./EnvironmentFields";
import { EventFields } from "./EventFields";
import { AreaField, TextField } from "./Fields";
import { OptionFields } from "./OptionFields";
import { MODULE_TYPES, adversaryPool, moduleIsValid } from "./actHelpers";

/* Popup for writing or editing one module of an act. Works on a draft copy;
 * nothing is saved until "Save". `module` null = closed. */
export const ModuleEditor = ({
	module,
	isNew,
	act,
	acts,
	onClose,
	onSave,
}: {
	module: ActModule | null;
	isNew: boolean;
	act: CampaignAct;
	acts: CampaignAct[];
	onClose: () => void;
	onSave: (module: ActModule) => Promise<boolean>;
}) => {
	const [draft, setDraft] = useState<ActModule | null>(module);
	const [creating, setCreating] = useState(isNew);
	const [busy, setBusy] = useState(false);
	// Start from the module each time the editor opens. Keep the last draft
	// while closing so the popup doesn't empty out during its fade.
	React.useEffect(() => {
		if (module) {
			setDraft(structuredClone(module));
			setCreating(isNew);
			setBusy(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [module]);

	if (!draft) return null;
	const meta = MODULE_TYPES[draft.type];
	const valid = moduleIsValid(draft);

	const submit = async () => {
		if (busy || !valid) return;
		setBusy(true);
		const ok = await onSave(draft);
		setBusy(false);
		if (ok) onClose();
	};

	return (
		<CampaignModal
			open={!!module}
			onClose={onClose}
			eyebrow={act.title}
			title={`${creating ? "New" : "Edit"} ${meta.label}`}
			sub={
				<span className={`chip ${meta.chip}`}>
					<Icon name={meta.icon} size={12} />
					{meta.blurb}
				</span>
			}
			width={draft.type === "adversary" || draft.type === "environment" ? 720 : 620}
			footer={
				<>
					<button type="button" className="button button-ghost" onClick={onClose}>
						Cancel
					</button>
					<button type="button" className="button button-primary" disabled={busy || !valid} onClick={submit}>
						<Icon name="check" size={14} />
						Save {meta.label}
					</button>
				</>
			}
		>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					submit();
				}}
			>
				{draft.type === "story" && <StoryFields module={draft} onChange={setDraft} />}
				{draft.type === "option" && <OptionFields module={draft} onChange={setDraft} acts={acts} actID={act.id} />}
				{draft.type === "adversary" && (
					<AdversaryFields module={draft} onChange={setDraft} pool={creating ? adversaryPool(acts) : undefined} />
				)}
				{draft.type === "encounter" && <EncounterFields module={draft} onChange={setDraft} acts={acts} />}
				{draft.type === "environment" && <EnvironmentFields module={draft} onChange={setDraft} acts={acts} />}
				{draft.type === "event" && <EventFields module={draft} onChange={setDraft} />}
			</form>
		</CampaignModal>
	);
};

const StoryFields = ({ module, onChange }: { module: StoryModule; onChange: (m: StoryModule) => void }) => (
	<>
		<TextField label="Title" value={module.title} placeholder="Arrival at Dusk" onChange={(title) => onChange({ ...module, title })} />
		<AreaField
			label="Story"
			rows={9}
			value={module.body}
			placeholder="The mill is already burning when the party crests the hill…"
			hint="Hidden from players until you reveal this story and its act."
			onChange={(body) => onChange({ ...module, body })}
		/>
	</>
);

/* Title + summary of an act, for creating a new one or editing an existing one. */
export const ActDetailsModal = ({
	open,
	act,
	campaign,
	onClose,
	onSave,
}: {
	open: boolean;
	act: CampaignAct | null;
	campaign: Campaign;
	onClose: () => void;
	onSave: (title: string, summary: string) => Promise<boolean>;
}) => {
	const [title, setTitle] = useState("");
	const [summary, setSummary] = useState("");
	const [busy, setBusy] = useState(false);
	React.useEffect(() => {
		if (open) {
			setTitle(act?.title ?? "");
			setSummary(act?.summary ?? "");
			setBusy(false);
		}
	}, [open, act]);
	const unchanged = !!act && title.trim() === act.title && summary.trim() === (act.summary ?? "");
	const disabled = busy || !title.trim() || unchanged;

	const submit = async () => {
		if (disabled) return;
		setBusy(true);
		const ok = await onSave(title.trim(), summary.trim());
		setBusy(false);
		if (ok) onClose();
	};

	return (
		<CampaignModal
			open={open}
			onClose={onClose}
			eyebrow={campaign.name}
			title={act ? "Edit Act" : "New Act"}
			width={600}
			footer={
				<>
					<button type="button" className="button button-ghost" onClick={onClose}>
						Cancel
					</button>
					<button type="button" className="button button-primary" disabled={disabled} onClick={submit}>
						<Icon name="check" size={14} />
						{act ? "Save Act" : "Create Act"}
					</button>
				</>
			}
		>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					submit();
				}}
			>
				<TextField label="Title" value={title} placeholder="The Burning Mill" onChange={setTitle} />
				<AreaField
					label="Summary"
					optional
					rows={4}
					value={summary}
					placeholder="What this part of the story is about, in a few lines."
					hint="Players see the title and summary once you reveal the act."
					onChange={setSummary}
				/>
			</form>
		</CampaignModal>
	);
};
