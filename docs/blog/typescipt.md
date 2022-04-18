---
title: typescript经验记录
tags: [Vue, React, typescript]
---

记录工作中遇到的有关Typescipt的问题以及ts版本更新有意义的信息。

## 1. 使用any是万能还是在挖坑的？
### 原因
有时候我们需要描述一个我们无法确定的类型变量，我们使用any的时候我们可以把任何类型的值赋值给any类型的变量，使用any类型类似于纯正的JavaScript的写码方式，是隐性的不可预知的
```typescript
let testDemo: any = { test: () => '我是测试any'' };
testDemo = '我是测试any'!;
testDemo = 5;
console.log(testDemo.test());
```

### 解决方法
为未知类型的变量定义为unknown类型，在编译期间发现错误

```typescript
const testDemo: unknown = "20";
console.log((testDemo as string).length);
testDemo.test();  //Object is of type 'unknown'
```

## 2. 对多值类型约定
### 原因
在React中，假设我们写一个button基础组件，需要对组件的type传人多个值，但是又需要约定值的种类

### 解决方法
1. 对类型定义为枚举类型如代码中的ButtonSize或ButtonType, 推荐 使用有更好的表达性

```typescript
import React from 'react';
import classNames from 'classnames';

export enum ButtonSize {
    Large = 'lg',
    Small = 'sm'
}

export enum ButtonType {
    Primary = 'primary',
    Default = 'default',
    Danger = 'danger',
    Link = 'link'
}

interface BaseButtonProps {
    className?: string,
    disabled?: boolean,
    size?: ButtonSize,
    btnType?: ButtonType,
    children: React.ReactNode,
    href?: string
}

type NativeButtonProps = BaseButtonProps & React.ButtonHTMLAttributes<HTMLElement>;
type AnchorButtonProps = BaseButtonProps & React.AnchorHTMLAttributes<HTMLElement>;
export type ButtonProps = Partial<NativeButtonProps & AnchorButtonProps>;

const Button: React.FC<ButtonProps> = (props) => {
    const { btnType, className, disabled, size, children, href, ...restProps } = props;
const classes = classNames('btn', className, {
        [`btn-${btnType}`]: btnType,
        [`btn-${size}`]: size,
        'disabled': (btnType === ButtonType.Link) && disabled
    })

    if (btnType === ButtonType.Link) {
        return <a
            className={classes}
            href={href}
            {...restProps}
        >
            {children}
        </a>
    } else {
        return (<button
            className={classes}
            disabled={disabled}
            {...restProps}
        >
            {children}
        </button>)
    }
}

Button.defaultProps = {
    disabled: false,
    btnType: ButtonType.Default
}

export default Button;
```

2.  使用typescrip字面量联合类型
``` typescript

export type ButtonSize = 'lg' | 'sm';

export type ButtonType = 'primary' | 'default' | 'danger' | 'link';
```
