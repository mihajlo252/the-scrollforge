import { Link } from "@tanstack/react-router";
import { Frame } from "../Frame/Frame";
import styles from "./ErrComp.module.css"

export const ErrComp = () => {
    return (
        <Frame classes="column-direction">
            <div className={styles.errorMessages}>
                <p>There was an error!</p>
                <p>Please go to the Homepage.</p>
            </div>
            <Link className="button button-primary center" to="/">
                Home
            </Link>
        </Frame>
    );
};
