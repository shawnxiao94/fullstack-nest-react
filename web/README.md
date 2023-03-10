<!--
 * @Author: shawnxiao 597035529@qq.com
 * @Date: 2022-11-26 23:27:00
 * @LastEditors: shawnxiao 597035529@qq.com
 * @LastEditTime: 2022-11-28 00:49:14
 * @FilePath: \react\react18-vite3-ts-antd4\README.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
# react18-vite3-ts-antd4

#### 介绍
react18-vite3-ts-antd4 React Router v6

#### 软件架构
软件架构说明


#### 安装教程

1.  初始化项目

```
npm create vite@latest
执行命令然后按照提示选择react ts直至完毕
```
此时你已经成功搭建出 Vite + React 的开发环境。🎉 🎉 🎉

2.  安装相关包

> 引入路由插件 react-router-dom
首选安装 react-router-dom，指令如下：

```
npm i react-router-dom -S
```

> 引入 Ant Design UI 组件库
```
npm i antd @ant-design/icons -S
```

目前最新版本 icon 包是分开的，所以这边顺带就把 @ant-design/icons 也安装了。

3.  环境变量如何获取

先修改 package.json 的 scripts 属性，如下所示：
```
  "dev": "vite --mode development",
  "build:beta": "tsc && vite build --mode beta",
  "build:release": "tsc && vite build --mode release",
  "preview": "vite preview"
```
--mode 后代表的是各个环境对应的环境变量值 官方定的，后续可以在页面中拿到这个变量值。

我们在 vite.config.js 打印如下所示：

```
console.log('process:::env', process.argv)

const env = process.argv[process.argv.length - 1]
```
最后一个参数，便是我们设置好的环境变量。所以我们可以通过如下获取环境变量：

我们可以在 vite.config.js 里配置 index.html 内，静态资源的路径前缀。改动如下：
```
...
const env = process.argv[process.argv.length - 1]
const base = config[env]
...
export default defineConfig({
	base: base.cdn
})
```

在根目录的 config 目录内，添加 index.js 文件，添加如下内容：
```
export default {
  development: {
    cdn: './',
    apiBaseUrl: '/api' // 开发环境接口请求，后用于 proxy 代理配置
  },
  beta: {
    cdn: '//s.xxx.com/vite-react-app/beta', // 测试环境 cdn 路径
    apiBaseUrl: '//www.beta.xxx.com/v1' // 测试环境接口地址
  },
  release: {
    cdn: '//s.xxx.com/vite-react-app/release', // 正式环境 cdn 路径
    apiBaseUrl: '//www.xxx.com/v1' // 正式环境接口地址
  }
}
```

运行时 那么运行代码的时候，我们如何获取到相应的环境变量呢？答案是 import.meta.env 。我们在 Index/index.tsx 里打印一下便可知晓：

```
import React from 'react'
import { Button } from 'antd'

export default function Index() {
  console.log('import.meta.env', import.meta.env)
  return <div>
    <Button type='primary'>Index</Button>
  </div>
}
```

resolve.alias 别名设置

和大多数的配置项类似，别名的配置也在 vite.config.js 中，我们打开它，添加如下代码：

```
export default defineConfig({
	...
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './'), // 根路径
      '@': path.resolve(__dirname, 'src') // src 路径
    }
  }
  ...
})
```

#### 配置vite

> vite-plugin-imp # 用于按需引入组件

```
npm i vite-plugin-svg-icons vite-plugin-html vite-plugin-eslint vite-plugin-compression rollup-plugin-visualizer -D
```

```
npm i postcss less autoprefixer @types/node @types/react-router-dom -D

```

#### 集成 eslint

执行的项目不支持common.js故需要把后缀名改为.cjs,

执行如下命令安装依赖
```
npm add -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-react eslint-plugin-prettier eslint-plugin-react-hook eslint-import-resolver-typescript -D
```

- eslint-plugin-prettier : 避免eslint和perttier冲突 
- eslint-plugin-react : 对 react 代码定制的 eslint 规则
- eslint-plugin-react-hook: 对 react-hook 代码定制的 eslint 规则
- eslint-import-resolver-typescript: 识别 ts 项目 alias 相对路径

```
# .eslintrc.cjs
extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
]
```

#### 安装prettier,在项目的根目录创建.prettierrc.cjs文件,完成自定义配置
```
npm i prettier -D

配置 .prettierrc.cjs

module.exports = {
  semi: false,
  trailingComma: "none",
  singleQuote: true,
  jsxSingleQuote: true,
  printWidth: 120,
  tabWidth: 2
}
```
> 避免eslint和perttier冲突 安装 eslint-config-prettier

```
npm i -D eslint-config-prettier eslint-plugin-prettier
```

#### stylelint安装配置

- stylelint-config-standard： 官网提供的 css 标准
- stylelint-config-recess-order： 属性排列顺序
- stylelint-prettier： 基于 prettier 代码风格的 stylelint 规则
- stylelint-config-prettier： 禁用所有与格式相关的 Stylelint 规则，解决 prettier 与 stylelint 规则冲突，确保将其放在 extends 队列最后，这样它将覆盖其他配置。


```
npm install -D stylelint stylelint-config-standard stylelint-config-rational-order stylelint-prettier stylelint-config-prettier
```

配置 .stylelintrc.cjs 文件

```
  module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-rational-order', 'stylelint-config-prettier'],
  rules: {
    // 颜色值小写
    "color-hex-case": "lower",
    // 注释前无须空行
    "comment-empty-line-before": "never",
    // 使用数字或命名的 (可能的情况下) font-weight 值
    "font-weight-notation": null,
    // 在函数的逗号之后要求有一个换行符或禁止有空白
    "function-comma-newline-after": null,
    // 在函数的括号内要求有一个换行符或禁止有空白
    "function-parentheses-newline-inside": null,
    // url使用引号
    "function-url-quotes": "always",
    // 字符串使用单引号
    "string-quotes": "single",
    // 禁止低优先级的选择器出现在高优先级的选择器之后
    "no-descending-specificity": null,
    // 禁止空源
    "no-empty-source": null,
    // 禁止缺少文件末尾的换行符
    "no-missing-end-of-source-newline": null,
    },
   };
```

#### 配置自动保存，新建.vscode文件夹，新增文件setting.json，增加以下语句：

```
{
    "editor.formatOnType": true,
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true,
      "source.fixAll.stylelint": true
    },
    "css.lint.unknownAtRules": "ignore",
    "scss.lint.unknownAtRules": "ignore"
}
```

#### 集成 husky、lint-staged、commitlint

> husky 插件的作用就是在 git hook 中添加操作, lint-staged 则可以准确的定位到暂存区的代码并对其操作

大致流程：
git commit前通过pre-commit（husky-hook）执行lint-staged脚本校验代码规范
如果校验失败，则阻止提交
继续通过commit-msg（husky-hook）执行commitlint脚本校验提交规范
如果校验失败，则阻止提交


6.6 使用lint-staged优化eslint检测速度
在上面配置的eslint会检测src文件下所有的 .ts, .tsx文件，虽然功能可以实现，但是当项目文件多的时候，检测的文件会很多，需要的时间也会越来越长，但其实只需要检测提交到暂存区，就是git add添加的文件，不在暂存区的文件不用再次检测，而lint-staged就是来帮我们做这件事情的。
安装依赖（lint-staged最新13版本需要node大于14.13.1版本,此处暂时用12版本，配置是一样的）

```
npm i lint-staged -D
```
修改package.json脚本eslint的配置
```
"eslint": "eslint"
```
在package.json添加lint-staged配置
```
"lint-staged": {
  "src/**/*.{ts,tsx}": [
    "npm run eslint"
  ]
},
```
因为要检测git暂存区代码，所以需要执行git init初始化一下git
```
git init
```
初始化git完成后就可以进行测试了，先提交一下没有语法问题的App.tsx

```
git add src/App.tsx
```

把src/App.tsx提交到暂存区后，执行npx lint-staged

可以看到检测通过了，没有检测到语法问题，再把有语法问题的src/main.tsx文件提交暂存区再检测一下看看

发现虽然main.tsx虽然有eslint语法警告，但依然验证成功了，是因为lint-staged只会检测到语法报错才会有提示只是警告不会，如果需要出现警告也阻止代码提交，需要给eslint检测配置参数 --max-warnings=0

代表允许最多0个警告，就是只要出现警告就会报错，修改完成后再次执行npx lint-staged

就会看到最终执行的命令是

```
eslint --max-warnings=0 "E:/wuyou/react/my-react-app/src/App.tsx" "E:/wuyou/react/my-react-app/src/main.tsx"
```

eslint只检测了git暂存区的App.tsx和main.tsx两个文件，做到了只检测git暂存区中文件的功能，避免每次都全量检测文件。

而添加了 --max-warnings=0 参数后，警告也可以检测出来并报错中断命令行了。


#### 七. 使用tsc检测类型和报错
在项目中使用了ts,但一些类型问题，现在配置的eslint是检测不出来的，需要使用ts提供的tsc工具进行检测，如下示例

在main.tsx定义了函数say,参数name是string类型，当调用传number类型参数时，页面有了明显的ts报错，但此时提交main.tsx文件到暂存区后执行npx lint-staged

发现没有检测到报错，所以需要配置下tsc来检测类型，在package.json添加脚本命令

```
"pre-check": "tsc && npx lint-staged"
```
执行npm run pre-check，发现已经可以检测出类型报错了。

#### 八. 项目git提交时检测语法规范

为了避免把不规范的代码提交到远程仓库，一般会在git提交代码时对代码语法进行检测，只有检测通过时才能被提交，git提供了一系列的githooks ，而我们需要其中的pre-commit钩子，它会在git commit把代码提交到本地仓库之前执行，可以在这个阶段检测代码，如果检测不通过就退出命令行进程停止commit。



.1 代码提交前husky检测语法
而husky就是可以监听githooks的工具，可以借助它来完成这件事情。

8.2 安装husky

```
npm i husky -D
```

8.3 配置husky的pre-commit钩子
生成 .husky配置文件夹（如果项目中没有初始化git,需要先执行git init）
```
npx husky install 
```

会在项目根目录生成 .husky文件夹，生成文件成功后，需要让husky支持监听pre-commit钩子，监听到后执行上面定义的npm run pre-check语法检测。

```
npx husky add .husky/pre-commit 'npm run pre-check'
```

会在 .husky目录下生成pre-commit文件，里面可以看到我们设置的npm run pre-check命令。

然后提交代码进行测试

```
git add .
git commit -m "feat: 测试提交验证"
```


会发现监听pre-commit钩子执行了npm rim pre-check, 使用eslint检测了git暂存区的两个文件，并且发现了main.tsx的警告，退出了命令行，没有执行git commit把暂存区代码提交到本地仓库。

到这里代码提交语法验证就配置完成了，可以有效的保障仓库的代码质量。

#### 九. 代码提交时检测commit备注规范

在提交代码时，良好的提交备注会方便多人开发时其他人理解本次提交修改的大致内容，也方便后面维护迭代，但每个人习惯都不一样，需要用工具来做下限制，在git提供的一系列的githooks 中，commit-msg会在git commit之前执行，并获取到git commit的备注，可以通过这个钩子来验证备注是否合理，而验证是否合理肯定需要先定义一套规范，而commitlint就是用来做这件事情的，它会预先定义一套规范，然后验证git commit的备注是否符合定义的规范。

9.1 安装和配置commitlint
安装commitlint
```
npm i @commitlint/config-conventional @commitlint/cli -D
```

在根目录创建commitlint.config.js文件,添加配置如下
```

module.exports = {
  // 继承的规则
  extends: ['@commitlint/config-conventional'],
  // 定义规则类型
  rules: {
    // type 类型定义，表示 git 提交的 type 必须在以下类型范围内
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能 feature
        'fix', // 修复 bug
        'docs', // 文档注释
        'style', // 代码格式(不影响代码运行的变动)
        'refactor', // 重构(既不增加新功能，也不是修复bug)
        'perf', // 性能优化
        'test', // 增加测试
        'chore', // 构建过程或辅助工具的变动
        'revert', // 回退
        'build' // 打包
      ]
    ],
    // subject 大小写不做校验
    'subject-case': [0]
  }
}
```

9.2 配置husky监听commit-msg

上面已经安装了husky,现在需要再配置下husky，让husky支持监听commit-msg钩子，在钩子函数中使用commitlint来验证

```
npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'
```
会在 .husky目录下生成 commit-msg文件，并且配置 commitlint命令对备注进行验证配置，配置完后就可以进行测试了（要把 main.tsx中的语法报错代码去掉并添加到暂存区）


再次执行git commit -m "修改xx功能"
再次提交后可以看到commit-msg验证没有通过，输入的备注信息为修改xx功能,下面提示项目描述信息和类型不能为空，代表验证起到作用。


使用正确格式的备注再次提交,类型和描述之间需要用冒号加空格隔开

```
git commit -m 'feat: 修改xx功能'
```

就可以看到提交成功了。

#### 十. 添加git commit辅助备注信息

在上面虽然定义了很多提交类型，但都是英文前缀，不容易记忆，可以添加辅助信息在我们提交代码的时候做选择，会方便很多，可以借助**commitizen**来实现这个功能。

10.1 安装commitizen
全局安装commitizen，否则无法执行插件的git cz命令：


```
npm i commitizen -g
```

在项目内安装cz-customizable：

```
npm i cz-customizable -D
```

10.2 配置commitizen自定义提示规则

添加以下配置到 package.json 中：
```
"config": {
    "commitizen": {
        "path": "./node_modules/cz-customizable"
    }
}
```

在根目录创建 .cz-config.cjs 自定义提示文件：
```
module.exports = {
   // 可选类型，和上面commitlint.config.js配置的规则一一对应
  types: [
    { value: 'feat', name: 'feat: 新功能' },
    { value: 'fix', name: 'fix: 修复' },
    { value: 'docs', name: 'docs: 文档变更' },
    { value: 'style', name: 'style: 代码格式(不影响代码运行的变动)' },
    { value: 'refactor', name: 'refactor: 重构(既不是增加feature，也不是修复bug)' },
    { value: 'perf', name: 'perf: 性能优化' },
    { value: 'test', name: 'test: 增加测试' },
    { value: 'chore', name: 'chore: 构建过程或辅助工具的变动' },
    { value: 'revert', name: 'revert: 回退' },
    { value: 'build', name: 'build: 打包' }
   ],
   // 消息步骤，正常只需要选择
  messages: {
   type: '请选择提交类型:',
     // customScope: '请输入修改范围(可选):',
   subject: '请简要描述提交(必填):',
     // body: '请输入详细描述(可选):',
   footer: '请输入要关闭的issue(可选):',
   confirmCommit: '确认使用以上信息提交？(y/n)'
   },
   // 跳过问题：修改范围，自定义修改范围，详细描述，issue相关
  skipQuestions: ['scope', 'customScope', 'body', 'footer'],
   // subject描述文字长度最长是72
  subjectLimit: 72
 }
```
10.3 测试commitizen辅助提交

使用git add添加文件到暂存区，然后使用git cz替代git commit命令提交代码：



会出现选择提交类型和填写提交描述信息，选择yes后，会触发git提交语法验证，最终提交成功了，提交的备注是feat: 添加commit辅助信息


#### 工程结构
.
├── README.md
├── index.html           项目入口
├── mock                 mock目录
├── package.json
├── public
├── src
│   ├── App.tsx          主应用
│   ├── app.module.less
│   ├── api              请求中心
│   ├── assets           资源目录（图片、less、css等）
│   ├── components       项目组件
│   ├── constants        常量
│   └── vite-env.d.ts    全局声明
│   ├── main.tsx         主入口
│   ├── pages            页面目录
│   ├── routes           路由配置
│   ├── types            ts类型定义
│   ├── store            状态管理
│   └── utils            基础工具包
├── test                 测试用例
├── tsconfig.json        ts配置
├── .eslintrc.js         eslint配置
├── .prettierrc.json     prettier配置
├── .gitignore           git忽略配置
└── vite.config.ts       vite配置

#### 使用说明

1.  xxxx
2.  xxxx
3.  xxxx

#### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request


#### 特技

1.  使用 Readme\_XXX.md 来支持不同的语言，例如 Readme\_en.md, Readme\_zh.md
2.  Gitee 官方博客 [blog.gitee.com](https://blog.gitee.com)
3.  你可以 [https://gitee.com/explore](https://gitee.com/explore) 这个地址来了解 Gitee 上的优秀开源项目
4.  [GVP](https://gitee.com/gvp) 全称是 Gitee 最有价值开源项目，是综合评定出的优秀开源项目
5.  Gitee 官方提供的使用手册 [https://gitee.com/help](https://gitee.com/help)
6.  Gitee 封面人物是一档用来展示 Gitee 会员风采的栏目 [https://gitee.com/gitee-stars/](https://gitee.com/gitee-stars/)
