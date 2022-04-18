---
title: iView经验记录
tags: [Vue, iView]
---

记录工作中遇到的有关iView的问题。

## 1. iView的表格列render函数中路由方法不生效问题

### 原因

组件初始化完毕后，render函数中的this指向当前的class类，不是Vue实例，所以不是在当前类的属性及方法都无法拿到。

```javascript
{
      title: '普通标签',
      key: 'normalLabel',
      align: 'center',
      width: 100,
      render: (h, params) => h('i-button', {
          props: {
              type: 'text',
          },
          style: {
              color: '#368BF2',
          },
          on: {
              click: () => {
                  this.$router.push({ name: 'dataManage.editLabel', params});
              },
          },
      }, '编辑'),
  },
```

### 解决方法
在类中定义路由跳转方法，在render函数中调用即可

## 2. iView组件问题

### menu组件手动改变激活的菜单项只第一次生效

#### 场景
手动设置active-name的值为‘name’，第一次可以触发。切换其他菜单项后再次设置值为‘name’不能触发。

#### 细节
active-name属性，是一个单项绑定的值，点击其他菜单项时active-name的值不会变化，所以再次设置为‘name’时active-name的值并没有变化，所以不会触发菜单项的变化

#### 解决方法

```javascript
<i-menu :active-name="activeMenu" @on-select="menuChange">

menuChange(activeMenuName) {
    this.activeMenu = activeMenuName;
}
```

## 3. i-select组件选项中间的文本若和开始标签的结束符在一行时，初始化默认文本会居中（加了很多空格）
如下

```javascript
<i-option v-for="(option, index) in options1" :value="option.value" :key="index">
    {{option.label}}
</i-option>
```

需要option.label紧跟开始标签的反括号后边

## 4. 表单验证时，不想显示默认的提示文字

``` javascript
// 需要校验，但不想显示提醒文字的时候，即便删除p标签也会显示默认的提示文字
<i-form-item label="起始端口" prop="startPort">
    <i-input-number
        :max="65535"
        :min="1"
        :step="1"
        v-model="form.startPort"
        :disabled="isdisabled"
        name="startPort"
        class="right-space"
    />
    <p class="tai-form-item-help-tip">取值范围为1到65535的整数，结束端口不能小于起始端口</p>
</i-form-item>
```

改成

``` javascript
// 需要校验，校验的时候也不会再显示默认的提醒信息
<i-form-item :show-message="false" label="起始端口" prop="startPort">
    <i-input-number
        :max="65535"
        :min="1"
        :step="1"
        v-model="form.startPort"
        :disabled="isdisabled"
        name="startPort"
        class="right-space"
    />
</i-form-item>
```

## 5. 模态框不手动关闭引发滚动条丢失

#### 场景
使用iView的模态框时，如果在执行弹框操作后未关闭就进行页面跳转，会引发滚动条消失。

#### 原因
弹框出现时，会给body元素添加一个`overflow: hidden`样式，如果未关闭就直接跳转，body层并不会再次渲染，该样式会保留，引发样式问题。

## 6. iView中<i-input type="textarea" v-model="text" /> 组件使用时，粘贴进来文本，在ie11里面text的值未发生改变

### 解决方法
监听blur事件重新赋值

## 7. 表单中只有一个input元素时，在该元素上回车会触发页面刷新

#### 原因
w3c标准中，表单只有一个input元素时，在该元素上回车会触发提交操作。

#### 解决方法
阻止该input元素默认的回车事件即可

## 8. `number`修饰器和`rules`校验规则设置细节

### 场景
针对表单验证中需要校验数字区间的场景，即填写的数字需要在`[min, max]`区间。

### 细节
1. 设置`v-model`的修饰器`number`，将输入直接转化为数字存储到模型变量中；
2. 确保iView的表单校验规则[async-validator](https://github.com/yiminghe/async-validator)中的`type`和模型变量的类型保持一致，即显示声明为`number`、`float`或`integer`类型（默认的数据类型是`string`）；
3. 如果校验规则中使用了`integer`，则进一步约束`v-model`中的`number`是整数，`float`同理；
4. `type`配置和对应的`require`、`min`和`max`联合使用，分别配置。

### 解决方法

```html
<i-input
    // 添加`number`修饰器
    v-model.number="form.disk"
    placeholder="请输入数据盘大小"
    type="number"
    name="disk"
    required
    min="20"
    max="500"
>
    <span slot="append">GB</span>
</i-input>
```

```javascript
// 分别设置校验规则
disk: [
    {
        required: true,
        type: 'integer',
        message: '需要输入数据盘大小',
        trigger: 'blur',
    },
    {
        type: 'integer',
        min: 20,
        message: '数据盘大小不能小于20',
        trigger: 'blur',
    },
    {
        type: 'integer',
        max: 500,
        message: '数据盘大小不能大于500',
        trigger: 'blur',
    },
],
```

## 9. iView中inputNumber问题

### 1. inputNumber限制只能输入整数
1. 强制方法(添加属性): precision="0"  代表数值精度为0，可以自动进行四舍五入整数校验
2. 用规则进行验证，给用户准确的建议，把控制权交给用户
```javascript
// 在表单验证规则中添加一条类型验证规则
{
    required: true,
    type: 'integer',
    message: '节点数量只支持整数',
    trigger: 'blur',
},
```

## 10. 表单校验中，对与简单的字符串和数组长度或数字大小限制的校验，可配置validator中的min和max值进行处理。

```javascript
// 未用min和max之前的代码
{
    validator: (rule, value, callback) => {
        if (this.form.desc) {
            if (!value.match(/^[\s\S]{2,255}$/)) {
                callback(new Error('描述信息长度为2-255字符'));
            }
        }
        callback();
    },
    message: '描述信息长度为2-255字符',
    trigger: 'blur',
},
```

```javascript
// 改用min和max之后的代码
{
    message: '描述信息长度为2-255字符',
    trigger: 'blur',
    min: 2,
    max: 255,
},
```

这样处理，代码可读性比较高，也节省了代码量。
https://github.com/yiminghe/async-validator (在Range处有对min和max的描述)

## 11. inputNuber组件回车提交异常解决（触发时机）

#### 业务场景
使用input-number组件进行数字输入，要求 inputValue < min 时，自动校验为min值，若当前模态框打开后未修改，点击提交，需要限制输入重复，不允许提交;

#### 问题
在使用 键盘Enter进行数值改变时，先触发校验，再更新当前input-number value数值，导致校验会有闪烁又消失的情况，再次点击回车，即使不符合校验规则，也会先执行submit() 再触发校验，表单会被成功提交；

#### 解决方法
监听 @keydown.enter.capture.prevent.native 来获取当前的event 对象 ，通过 event.target 拿到当前输入的值，赋给表单的 form.num；

#### 注意
这个地方是在走校验之前执行的，所以要对input-number 的输入进行容错；拿到的value 是一个string类型，我们需要对这个进行转换，那么如果输入为空，value值为null，会被转为 0 ；

bug又出现了！！！ 显示提示语： 请输入修改量，但不合法的修改量被校正为0 了，真难受😣

#### 解决方案
1. this.form.num = Number(event.target.value) || null; 当输入值为null时候，不进行 0转换，直接显示为空；
bug再次现身!!!
enter事件之后居然没有失去焦点，导致输入框中的值不会自动修正，交互方式不一致；
2. 手动强制设置失焦；
`event.target.blur()`

## 12. Date类型验证
例如时间，iView绑定的是Date类型的，最后要转化为毫秒值提交。
这种情况下即使已经验证了，也不能直接改变表单数据类型，需重新赋值给一个新对象后修改。

## 13. select组件在remote 模式下设置v-model初始化值默认选中不生效
因为仅通过 value 无法得知选项的 label，需手动设置。
解决办法：初始化对应value的label到select组件的label属性即可


