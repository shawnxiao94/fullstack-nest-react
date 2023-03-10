/*
 * @Author: shawnxiao 597035529@qq.com
 * @Date: 2022-11-27 00:42:52
 * @LastEditors: shawnxiao 597035529@qq.com
 * @LastEditTime: 2022-11-28 01:54:07
 * @FilePath: \react\react18-vite3-ts-antd4\.stylelintrc.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// @see: https://stylelint.io

module.exports = {
	extends: [
		"stylelint-config-standard", // 配置stylelint拓展插件
		'stylelint-config-rational-order',
		"stylelint-config-prettier", // 配置stylelint和prettier兼容
	],
	"plugins":["stylelint-less"],
	rules: {
		"at-rule-no-unknown": null,
		// indentation: 4, // 指定缩进空格
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
	}
};
