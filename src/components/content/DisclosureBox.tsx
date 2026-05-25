import { SHORT_DISCLAIMER } from '@/lib/compliance/minecraftDisclaimer';

export function DisclosureBox() {
  return <aside className="disclosure-box"><strong>Independent tool and affiliate disclosure.</strong><p>{SHORT_DISCLAIMER} Calculations run in your browser; no Minecraft files or accounts are uploaded. If future pages include affiliate links, they must be clearly labeled and never presented as official recommendations or tool controls.</p></aside>;
}
