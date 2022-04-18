---
title: Vue指令经验记录
tags: [Vue, Directive]
---

Vue指令是一种装饰器模式，用于简化代码逻辑。

## 1. `v-timely-validate`

### 指令作用
将表单验证规则`rules`中验证的触发时机从`blur`修改为`change`，以及时消除错误。

### 表单构成
通常表单共有 label、input（包含radio、checkbox、select、slider等）、placeholder、help-tip、error-message 5部分。

其中 error-message 可以看做 help-tip的加强版，是为了给用户更强烈的提示作用，促进用户更准确的填写表单。所以，error-message 应该是 help-tip 的拆解，按验证规则优先级顺序给用户更准确、更具体的错误信息。

在上面的前提下，为了简化用户所看到的表单结构，error-message 覆盖掉 help-tip，两类信息不同时出现。

### 表单分类
1. 选择型，针对选择型表单，建议设置默认值，如果不能设置默认值，直接设置检验时机为**change**（单个表单的blur意义不大，一组表单的blur比较复杂，保证用户操作体验的前提下先简化处理）。
2. 输入型。

### 输入型表单的验证时机
1. input表单第一次提交表单验证的时机是**blur**（初次输入时，让用户保持安静以完整输入，避免初次输入时对用户的频繁干扰）；
2. 当验证触发后（1中的blur或表单的提交触发），将输入型表单的验证时机调整为**change**（尽快消除错误，让用户尽早恢复喜悦）。

### 表单校验原则
1. 尽量不强行阻止用户（比如`text`表单元素中不截断用户的超长度输入，`number`表单元素中不阻止用户输入字符等，及时提醒就好）；
2. 及时提醒用户出错；
3. 不打扰用户正常输入（比如第一次输入用`blur`时机校验）；
4. 尽早消除错误提醒（比如有了出错提醒后用`change`时机校验）；

### 使用方法
1. 在`i-form`表单组件中添加`v-timely-validate`指令；
2. 在`i-input`等表单元素组件中添加跟`rules`对应的`name`属性；
3. 在`i-form`的`rules`中使用`blur`触发；
4. 在`i-form-item`中添加 help-tip 元素，并为该元素添加`tai-form-item-help-tip`类（借助了`i-input`所隐藏的状态机）。

### 代码示例

```javascript
export default {
    bind(el, binding, vnode) {
        const { rules } = vnode.componentInstance;

        if (!rules) {
            return;
        }

        function blurToChange(name) {
            const inputRules = rules[name];
            if (!inputRules || !Array.isArray(inputRules) || inputRules.length === 0) {
                return;
            }

            setTimeout(() => {
                inputRules.forEach((item) => {
                    const clone = Object.assign({}, item, { trigger: 'change' });
                    const result = inputRules.find(j => _.isEqual(j, clone));
                    if (!result) {
                        inputRules.push(clone);
                    }
                });
            }, 500);
        }

        function handleSubmit() {
            const keys = Object.keys(rules);
            keys.forEach(blurToChange);
            el.removeEventListener('submit', handleSubmit, true);
        }

        function handleBlur(event) {
            const { name, tagName } = event.target;

            if ((tagName !== 'INPUT' && tagName !== 'TEXTAREA') || !name) {
                return;
            }

            blurToChange(name);
        }

        // 事件的监听后续可以考虑使用passive配置以提高性能
        el.addEventListener('submit', handleSubmit, true);
        el.addEventListener('blur', handleBlur, true);
    },
};
```

```html
<i-form
    v-timely-validate
    ref="iForm"
    :model="form"
    :rules="rules"
    @submit.native.prevent="handleSubmit"
>
    <i-form-item label="用户账号" prop="account">
        <i-input v-model="form.account" name="account" placeholder="请输入用户账号" />
        <p class="form-tip-name form-tip">由小写字母，数字，下划线组成，字母开头，最长16个字符</p>
    </i-form-item>
</i-form>
```
