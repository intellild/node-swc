
const swc = require('../../lib/index');

it('should handle minify', () => {
    const src = '/* Comment */import foo, {bar} from "foo"';

    expect(swc.transformSync(src, {
        minify: true,
    }).code.trim()).toBe("import foo,{bar}from'foo';");
});

it('should handle exportNamespaceFrom', () => {
    const src = "export * as Foo from 'bar';";
    const out = swc.transformSync(src, {
        jsc: {
            parser: {
                syntax: "ecmascript",
                exportNamespaceFrom: true,
            }
        }
    });

    expect(out.code).toContain("import * as _Foo from 'bar';");
    expect(out.code).toContain("export { _Foo as Foo }");
});

it('should handle exportNamespaceFrom configured by .swcrc', () => {
    const out = swc.transformFileSync(__dirname + '/../../issue-226/input.js');

    expect(out.code).toContain("import * as _Foo from 'bar';");
    expect(out.code).toContain("export { _Foo as Foo }");
});

it('should handle jsc.target = es3', () => {
    const out = swc.transformSync(`foo.default`, {
        jsc: {
            target: 'es3'
        }
    });
    expect(out.code.trim()).toBe(`foo['default'];`)
});

it('should handle jsc.target = es5', () => {
    const out = swc.transformSync(`foo.default`, {
        jsc: {
            target: 'es5'
        }
    });
    expect(out.code.trim()).toBe(`foo.default;`)
});