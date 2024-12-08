import { Settings } from "@api/Settings";
import ErrorBoundary from "@components/ErrorBoundary";
import definePlugin, { OptionType } from "@utils/types";
import { React } from "@webpack/common";

export default definePlugin({
    name: "MediaLoop",
    description: "Adds a loop button to Discord videos and audio files.",
    authors: [{ name: "YourName", id: "YourID" }],
    options: {
        defaultLoopState: {
            type: OptionType.BOOLEAN,
            description: "Enable looping by default for all videos and audio.",
            default: false
        }
    },
    start() {
        this.addLoopButton("video");
        this.addLoopButton("audio");
    },
    addLoopButton(type: "video" | "audio") {
        const controlsClass = type === "video" ? "videoControls__7bc92" : "audioControls_da7066";
        const observer = new MutationObserver(() => {
            document.querySelectorAll(`[class*=${controlsClass}]`).forEach(el => {
                const element = el as HTMLElement;
                if (element.classList.contains("AddedLoop")) return;
                element.classList.add("AddedLoop");
                const button = document.createElement("div");
                button.innerHTML = `
                    <svg aria-hidden="false" width="16" height="16" viewBox="0 0 24 24" style="cursor: pointer;">
                        <path fill="currentColor" d="M17.673 7.35l2.828-2.828h-7.071v7.071l2.828-2.828c2.34 2.34 2.34 6.145 0 8.485-2.34 2.34-6.145 2.34-8.485 0-2.34-2.34-2.34-6.145 0-8.485L6.36 7.35c-3.125 3.125-3.125 8.188 0 11.313 3.125 3.125 8.188 3.125 11.313 0 3.125-3.125 3.125-8.188 0-11.314zM6.327 18.696L3.498 21.525h7.071v-7.071l-2.828 2.828c-2.34-2.34-2.34-6.145 0-8.485 2.34-2.34 6.145-2.34 8.485 0 2.34 2.34 2.34 6.145 0 8.485l1.414 1.414c3.125-3.125 3.125-8.188 0-11.314-3.125-3.125-8.188-3.125-11.314 0-3.125 3.125-3.125 8.188 0 11.314z"></path>
                    </svg>
                `;
                button.onclick = () => this.toggleLoop(element, type);
                element.insertBefore(button, element.children[1]);
            });
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    },
    toggleLoop(el: HTMLElement, type: "video" | "audio") {
        const mediaElement = el.closest("div")?.parentElement?.querySelector(type.toUpperCase() as keyof HTMLElementTagNameMap) as HTMLMediaElement | null;
        if (!mediaElement) return;
        const loopState = !mediaElement.loop;
        mediaElement.loop = loopState;
        const button = el.querySelector("svg") as SVGElement;
        if (button) {
            button.style.color = loopState ? "var(--brand-experiment)" : "";
            button.style.opacity = loopState ? "1" : "";
        }
    },
    render() {
        return (
            <ErrorBoundary noop>
                <p>Media Loop plugin is active.</p>
            </ErrorBoundary>
        );
    } // This was missing the closing brace
}); // Closing the plugin definition here
