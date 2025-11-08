import * as path from "path";
import { Converter, DeclarationReflection, ReflectionKind, Renderer } from "typedoc";
// import { DeclarationReflection } from "typedoc/dist/lib/models/reflections";
// import { ReflectionKind } from "typedoc/dist/lib/models/reflections/kind";
// import { Renderer } from "typedoc/dist/lib/output/renderer";

export function load(app) {
    // 存储文件路径和对应的反射对象
    const fileReflections = new Map();
    console.log("开始加载自定义插件",);
    // 监听声明创建事件 
    app.converter.on(Converter.EVENT_CREATE_DECLARATION, (context, reflection) => {
        console.log("开始监听声明创建事件");
        const project = context.project;
        project.children?.forEach((child) => {
            console.log("child", child);
        })
        // if (!reflection.sources?.length) return;

        // const source = reflection.sources[0];
        // const filePath = path.relative(process.cwd(), source.fileName);
        // console.log("filePath", filePath);
        // console.log("reflection", reflection);
        // // 按文件路径组织反射对象
        // if (!fileReflections.has(filePath)) {
        //     fileReflections.set(filePath, reflection);
        // }
    });

    // 监听渲染开始事件
    // app.renderer.on(Renderer.EVENT_BEGIN, (event) => {
    //     // console.log("开始监听渲染开始事件", event);
    //     const project = event.project;

    //     // 创建按文件组织的新结构
    //     const fileGroups = new Map();

    //     // 遍历所有反射对象，按文件分组
    //     project.getReflectionsByKind(ReflectionKind.All).forEach(reflection => {
    //         if (!reflection.sources?.length) return;
    //         console.log("reflection", reflection);
    //         // 按文件路径组织反射对象
    //         const source = reflection.sources[0];
    //         const filePath = path.relative(process.cwd(), source.fileName);
    //         const dirPath = path.dirname(filePath);

    //         if (!fileGroups.has(dirPath)) {
    //             fileGroups.set(dirPath, []);
    //         }
    //         fileGroups.get(dirPath)?.push(reflection);
    //     });

    //     // 重组项目结构
    //     // project.children = Array.from(fileGroups.entries()).map(([dirPath, reflections]) => {
    //     //     const groupReflection = new DeclarationReflection(
    //     //         dirPath,
    //     //         ReflectionKind.Module,
    //     //         project
    //     //     );
    //     //     groupReflection.children = reflections;
    //     //     return groupReflection;
    //     // });
    // });

    // 监听渲染结束事件
    app.renderer.on(Renderer.EVENT_END, () => {
        console.log("文档生成完成，已按文件结构组织");
    });
}