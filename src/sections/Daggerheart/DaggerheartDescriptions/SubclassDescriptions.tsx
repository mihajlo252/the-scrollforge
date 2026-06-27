import { useEffect, useState } from "react";
import { Capitalize } from "../../../utilities/capitalize";
import { DescriptionScrollContainer } from "../Components/DescriptionScrollContainer";
export const SubclassDescriptions = ({ name, subclasses }: { name: string; subclasses: any }) => {
	const [currentSubclass, setCurrentSubclass] = useState(subclasses.find((c: any) => c.name === name));

	useEffect(() => {
		setCurrentSubclass(subclasses.find((c: any) => c.name === name));
	}, [name]);

	return (
		<>
			<h2 className="text-content text-accent">{name}</h2>
			<span className="mid-eyebrow text-accent">{Capitalize(currentSubclass?.class)}</span>
			<DescriptionScrollContainer>
				{currentSubclass.spellcastTrait && (
					<p>
						<span className="text-primary">Spellcast Trait:</span> {Capitalize(currentSubclass?.spellcastTrait)}
					</p>
				)}
				<div className="flex flex-col gap-1">
					<h3 className="text-lg text-accent">Foundation Features</h3>
					<ul className="list-disc">
						{currentSubclass?.foundation.features.map((feature: any) => (
							<li key={feature.name} className="list-item">
								<span className=" text-primary ">{feature.name}:</span> {feature.description[0].paragraph}
							</li>
						))}
					</ul>
				</div>
				<div className="flex flex-col gap-1">
					<h3 className="text-lg text-accent">Specialization Features</h3>
					<ul className="list-disc">
						{currentSubclass?.specialization.features.map((feature: any) => (
							<li key={feature.name} className="list-item">
								<span className=" text-primary ">{feature.name}:</span> {feature.description[0].paragraph}
							</li>
						))}
					</ul>
				</div>
				<div className="flex flex-col gap-1">
					<h3 className="text-lg text-accent">Mastery Features</h3>
					<ul className="list-disc">
						{currentSubclass?.mastery.features.map((feature: any) => (
							<li key={feature.name} className="list-item">
								<span className=" text-primary ">{feature.name}:</span> {feature.description[0].paragraph}
							</li>
						))}
					</ul>
				</div>
			</DescriptionScrollContainer>
		</>
	);
};
