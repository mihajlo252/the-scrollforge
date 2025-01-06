import { createLazyFileRoute } from "@tanstack/react-router";
import { BoxSection } from "../components/BoxSection";
import { useState } from "react";
import { sendBug } from "../utilities/sendBug";
import { getUserFromLocal } from "../utilities/getUserFromLocal";

export const Route = createLazyFileRoute("/bug-report")({
    component: BugReport,
});

function BugReport() {
    const [short, setShort] = useState<string>("");
    const [bug, setBug] = useState<string>("");

    const { user } = JSON.parse(getUserFromLocal());


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const report: BugReport = {
            title: short,
            description: bug,
            priority: "low",
            user_id: user.id,
        }

        sendBug(report);
    };

    return (
        <BoxSection styles="w-full h-full p-5 justify-center items-center">
            <form className="flex h-full w-1/2 flex-col items-center justify-center gap-5 text-left" onSubmit={(e) => handleSubmit(e)}>
                <div className="flex w-full flex-col gap-2">
                    <label htmlFor="short">Short Description:</label>
                    <input
                        type="text"
                        name="short"
                        id="short"
                        onChange={(e) => setShort(e.target.value)}
                        value={short}
                        placeholder="Short Description"
                        className="input input-bordered"
                    />
                </div>
                <div className="flex w-full flex-col gap-2">
                    <label htmlFor="bug">Full Description:</label>
                    <textarea
                        name="bug"
                        id="bug"
                        onChange={(e) => setBug(e.target.value)}
                        value={bug}
                        placeholder="Describe your problem"
                        className="textarea textarea-bordered"
                    />
                </div>

                <button type="submit" className="btn btn-primary">
                    Submit
                </button>
            </form>
        </BoxSection>
    );
}
