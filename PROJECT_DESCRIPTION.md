# Digital Journal

## Inspiration
The inspiration for Digital Journal came from a desire to bring the tactile, nostalgic feel of physical journaling into the digital age. We wanted to pay homage to the classic, skeuomorphic "Curl" animation found in early iOS books—a beloved feature that was briefly removed but brought back due to popular demand. We believe that the interaction of turning a page adds a layer of mindfulness and intention to the act of writing that is often lost in standard text editors.

## What it does
Digital Journal is a simple, interactive journal book that allows users to write and customize their entries. It features a realistic page-turning effect that mimics a real book. Users can flip through pages, write their thoughts, and enjoy a distraction-free writing environment that feels personal and grounded.

## How we built it
The project started with an initial design phase in **Figma**, where we crafted the visual aesthetic to balance modern cleanliness with skeuomorphic charm.

For the development, we used a modern web stack:
*   **React** & **TypeScript** for the core application logic and component structure.
*   **Vite** for a fast and efficient build process.
*   **Tailwind CSS** and **Shadcn UI** for styling and UI components.
*   **Kiro** was instrumental in implementing the core interactive component. We utilized **turn.js** (a legacy jQuery plugin) to achieve the realistic page-flip effect, which Kiro helped integrate seamlessly into our React environment.

## Built with
*   **Languages**: TypeScript, JavaScript, HTML5, CSS3
*   **Frameworks & Libraries**: React, jQuery, turn.js
*   **Platforms**: Web (Vite)
*   **Styling**: Tailwind CSS, Shadcn UI, Lucide React (Icons)
*   **Design**: Figma
*   **Tools**: Kiro (AI Coding Assistant), npm

## Challenges we ran into
One of the main challenges was integrating `turn.js`, a library designed for the jQuery era, into a modern React functional component architecture. Managing the lifecycle events and DOM manipulations required for the page flip effect without conflicting with React's virtual DOM was tricky. Additionally, ensuring the animations felt smooth and responsive across different screen sizes required careful tuning.

## Accomplishments that we're proud of
We are particularly proud of the seamless "old-meets-new" experience. We successfully revived a classic interaction pattern (the page curl) and made it feel native in a modern web application. The collaboration between the Figma design and the Kiro-assisted implementation resulted in a polished product that looks and feels great.

## What we learned
We learned a lot about the nuances of skeuomorphic design and why it still holds value for users—it provides affordances that make digital tools feel more intuitive and friendly. We also gained deep insights into bridging the gap between legacy JavaScript libraries and modern frameworks, finding creative solutions to make them work together harmoniously.

## What's next for Digital Journal
Moving forward, we plan to expand the customization options, allowing users to choose different cover designs, paper textures, and pen styles. We also aim to implement cloud synchronization so users can access their journals across devices, and potentially add multimedia support to allow for scrapbooking-style entries.
