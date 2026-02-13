import { join } from 'node:path';
import type { StackforgeConfig } from '../../types/config.js';
import { ensureDir, readTextFile, writeTextFile } from '../../utils/file-system.js';
import type { GeneratorContext } from '../context.js';
import { TEMPLATES_DIR } from '../../utils/templates-dir.js';

export async function generateUiFiles(
  root: string,
  config: StackforgeConfig,
  ctx?: GeneratorContext
): Promise<void> {
  const projectRoot = join(root, config.projectName);
  const templatesRoot = TEMPLATES_DIR;

  if (config.ui.library === 'tailwind') {
    const tailwindTemplate = await readTextFile(join(templatesRoot, 'ui', 'tailwind.config.js'));
    const postcssTemplate = await readTextFile(join(templatesRoot, 'ui', 'postcss.config.js'));
    const stylesTemplate = await readTextFile(join(templatesRoot, 'ui', 'styles.css'));

    await writeTextFile(join(projectRoot, 'tailwind.config.js'), tailwindTemplate, ctx);
    await writeTextFile(join(projectRoot, 'postcss.config.js'), postcssTemplate, ctx);

    const stylesDir = join(projectRoot, 'src');
    await ensureDir(stylesDir, ctx);
    await writeTextFile(join(stylesDir, 'styles.css'), stylesTemplate, ctx);

    const demo = await readTextFile(
      join(templatesRoot, 'ui', config.frontend.language === 'ts' ? 'demo-tailwind.tsx' : 'demo-tailwind.jsx')
    );
    await ensureDir(join(projectRoot, 'src', 'components'), ctx);
    await writeTextFile(
      join(projectRoot, 'src', 'components', config.frontend.language === 'ts' ? 'ui-demo.tsx' : 'ui-demo.jsx'),
      demo,
      ctx
    );
  }

  if (config.ui.library === 'shadcn') {
    await ensureDir(join(projectRoot, 'components'), ctx);
    const shadcnReadme = await readTextFile(join(templatesRoot, 'ui', 'shadcn.README.md'));
    await writeTextFile(join(projectRoot, 'components', 'README.md'), shadcnReadme, ctx);

    const componentsJson = await readTextFile(join(templatesRoot, 'ui', 'components.json'));
    await writeTextFile(join(projectRoot, 'components.json'), componentsJson, ctx);

    const srcDir = join(projectRoot, 'src');
    await ensureDir(join(srcDir, 'lib'), ctx);
    await ensureDir(join(srcDir, 'components', 'ui'), ctx);
    const ext = config.frontend.language === 'ts' ? 'ts' : 'js';
    const utilsTemplate = await readTextFile(join(templatesRoot, 'ui', `utils.${ext}`));
    await writeTextFile(join(srcDir, 'lib', `utils.${ext}`), utilsTemplate, ctx);
    const buttonTemplate = await readTextFile(
      join(templatesRoot, 'ui', config.frontend.language === 'ts' ? 'button.tsx' : 'button.jsx')
    );
    await writeTextFile(join(srcDir, 'components', 'ui', config.frontend.language === 'ts' ? 'button.tsx' : 'button.jsx'), buttonTemplate, ctx);

    const demo = await readTextFile(
      join(templatesRoot, 'ui', config.frontend.language === 'ts' ? 'demo-shadcn.tsx' : 'demo-shadcn.jsx')
    );
    await writeTextFile(
      join(srcDir, 'components', config.frontend.language === 'ts' ? 'ui-demo.tsx' : 'ui-demo.jsx'),
      demo,
      ctx
    );
  }

  if (['mui', 'chakra', 'mantine', 'antd', 'nextui'].includes(config.ui.library)) {
    await ensureDir(join(projectRoot, 'components'), ctx);
    const readme = await readTextFile(join(templatesRoot, 'ui', `${config.ui.library}.README.md`));
    await writeTextFile(join(projectRoot, 'components', 'README.md'), readme, ctx);

    const srcDir = join(projectRoot, 'src');
    await ensureDir(srcDir, ctx);
    const ext = config.frontend.language === 'ts' ? 'ts' : 'js';
    const themeTemplate = await readTextFile(join(templatesRoot, 'ui', `${config.ui.library}.theme.${ext}`));
    await writeTextFile(join(srcDir, `theme.${ext}`), themeTemplate, ctx);

    const demo = await readTextFile(
      join(templatesRoot, 'ui', `demo-${config.ui.library}.${config.frontend.language === 'ts' ? 'tsx' : 'jsx'}`)
    );
    await ensureDir(join(srcDir, 'components'), ctx);
    await writeTextFile(
      join(srcDir, 'components', config.frontend.language === 'ts' ? 'ui-demo.tsx' : 'ui-demo.jsx'),
      demo,
      ctx
    );
  }

}
