import React, { useId } from "react";
import { Icon } from "../../../components/Primitives";
import campaignStyles from "../../../routeStyles/campaigns.module.css";
import styles from "./Acts.module.css";

/* Small labelled inputs shared by the module editors, styled like the other
 * campaign popups (Forge a Campaign, Edit Chronicle). */

const Label = ({ id, label, optional }: { id: string; label: string; optional?: boolean }) => (
	<label className="field-label" htmlFor={id}>
		{label}
		{optional && <span className={campaignStyles.opt}>optional</span>}
	</label>
);

export const TextField = ({
	label,
	value,
	onChange,
	placeholder,
	optional,
	className = "",
}: {
	label: string;
	value: string | undefined;
	onChange: (v: string) => void;
	placeholder?: string;
	optional?: boolean;
	className?: string;
}) => {
	const id = useId();
	return (
		<div className={`${campaignStyles.field} ${className}`}>
			<Label id={id} label={label} optional={optional} />
			<input id={id} className="input" value={value ?? ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
		</div>
	);
};

export const AreaField = ({
	label,
	value,
	onChange,
	placeholder,
	optional,
	rows = 4,
	hint,
}: {
	label: string;
	value: string | undefined;
	onChange: (v: string) => void;
	placeholder?: string;
	optional?: boolean;
	rows?: number;
	hint?: string;
}) => {
	const id = useId();
	return (
		<div className={campaignStyles.field}>
			<Label id={id} label={label} optional={optional} />
			<textarea
				id={id}
				className={`input ${campaignStyles.textarea}`}
				rows={rows}
				value={value ?? ""}
				placeholder={placeholder}
				onChange={(e) => onChange(e.target.value)}
			></textarea>
			{hint && <span className={campaignStyles.fieldHint}>{hint}</span>}
		</div>
	);
};

export const NumField = ({
	label,
	value,
	onChange,
	min,
	max,
	placeholder,
}: {
	label: string;
	value: number | null | undefined;
	onChange: (v: string) => void;
	min?: number;
	max?: number;
	placeholder?: string;
}) => {
	const id = useId();
	return (
		<div className={campaignStyles.field}>
			<Label id={id} label={label} />
			<input
				id={id}
				type="number"
				inputMode="numeric"
				className="input mono"
				min={min}
				max={max}
				placeholder={placeholder ?? "—"}
				value={value ?? ""}
				onChange={(e) => onChange(e.target.value)}
			/>
		</div>
	);
};

export const SelectField = ({
	label,
	value,
	onChange,
	children,
}: {
	label: string;
	value: string | number;
	onChange: (v: string) => void;
	children: React.ReactNode;
}) => {
	const id = useId();
	return (
		<div className={campaignStyles.field}>
			<Label id={id} label={label} />
			<select id={id} className="select" value={value} onChange={(e) => onChange(e.target.value)}>
				{children}
			</select>
		</div>
	);
};

// Section heading inside an editor, with an optional "Add" button on the right.
export const FieldGroup = ({
	title,
	onAdd,
	addLabel = "Add",
	children,
}: {
	title: string;
	onAdd?: () => void;
	addLabel?: string;
	children: React.ReactNode;
}) => (
	<fieldset className={styles.group}>
		<legend className={styles.groupHd}>
			<span className="caps">{title}</span>
			{onAdd && (
				<button type="button" className={`button button-ghost ${styles.addBtn}`} onClick={onAdd}>
					<Icon name="plus" size={12} />
					{addLabel}
				</button>
			)}
		</legend>
		{children}
	</fieldset>
);

// A removable, reorderable row inside a FieldGroup (choices, features, actions).
export const ListRow = ({
	children,
	onRemove,
	onMoveUp,
	onMoveDown,
	removeLabel,
}: {
	children: React.ReactNode;
	onRemove: () => void;
	onMoveUp?: () => void;
	onMoveDown?: () => void;
	removeLabel: string;
}) => (
	<div className={styles.listRow}>
		<div className={styles.listRowBody}>{children}</div>
		<div className={styles.listRowTools}>
			{onMoveUp && (
				<button type="button" className="sf-icon-btn" onClick={onMoveUp} aria-label="Move up" title="Move up">
					<span className={styles.arrowUp}>
						<Icon name="fwd" size={13} />
					</span>
				</button>
			)}
			{onMoveDown && (
				<button type="button" className="sf-icon-btn" onClick={onMoveDown} aria-label="Move down" title="Move down">
					<span className={styles.arrowDown}>
						<Icon name="fwd" size={13} />
					</span>
				</button>
			)}
			<button type="button" className="sf-icon-btn" onClick={onRemove} aria-label={removeLabel} title={removeLabel}>
				<Icon name="close" size={13} />
			</button>
		</div>
	</div>
);
