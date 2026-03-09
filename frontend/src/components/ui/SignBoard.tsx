import { type ReactNode } from "react";
import "./SignBoard.css";

/* ==================================================================
   SignBoard — reusable hand-drawn notice board
   ================================================================== */
interface SignBoardProps {
    children: ReactNode;
    maxWidth?: string;       // e.g. "920px" (default) or "800px"
    className?: string;      // extra class on the outer wrapper
}

const SignBoard = ({ children, maxWidth = "920px", className = "" }: SignBoardProps) => (
    <div
        className={`signboard-wrapper fade-in-up ${className}`}
        style={{ maxWidth }}
    >
        <div className="signboard-panel">
            <span className="signboard-nail signboard-nail-tl" />
            <span className="signboard-nail signboard-nail-tr" />
            <span className="signboard-nail signboard-nail-bl" />
            <span className="signboard-nail signboard-nail-br" />
            {children}
        </div>

        <div className="signboard-legs">
            <div className="signboard-leg signboard-leg-left" />
            <div className="signboard-leg signboard-leg-right" />
        </div>
    </div>
);

export default SignBoard;
