import { Link } from "@tanstack/react-router";
import { BoxSection } from "../BoxSection/BoxSection";
import styles from "./ErrComp.module.css"

export const ErrComp = () => {
    return (
        <BoxSection classes="column-direction">
            <div className={styles.errorMessages}>
                <p>There was an error!</p>
                <p>Please go to the Homepage.</p>
            </div>
            <Link className="button button-primary center" to="/">
                Home
            </Link>
        </BoxSection>
    );
};
