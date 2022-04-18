---
title: 状态实践
sidebar_label: 状态实践
---

状态类代码是前端应用中最容易Dead Code和复杂化的代码，很难清晰的辨识某字段、某方法是否还在使用，尤其是单一状态树中的代码很多都是字符串的使用，静态分析类的工具无能为力。

状态设计的核心思想是“只读思想”，核心原则是“开闭原则”。即开闭原则鼓励写 “只读” 的业务模块，一经设计就不可修改，如果要修改业务就直接废弃它，转而实现新的业务模块。

Store状态是应用/模块设计的核心，Prop状态是组件设计的核心，这两者代表了需求分析后所沉淀的稳定点——需求的稳定点，往往是系统的核心价值点；而需求的变化点，则往往需要相应去做开放性设计，比如：
1. 冯·诺依曼体系的中央处理器（CPU）的设计完美体现了 “开闭原则” 的架构思想。它表现在：
指令是稳定的，但指令序列是变化的，只有这样计算机才能够实现 “解决一切可以用 ‘计算’ 来解决的问题” 这个目标。
2. 计算是稳定的，但数据交换是多变的，只有这样才能够让计算机不必修改基础架构却可以适应不断发展变化的交互技术革命。


## 一、Store范式设计
单一状态树类代码一般包含数据存储部分的State、数据读取部分的Getter、数据变更部分的Mutation和数据操作部分的Action，组成一个完整的业务模型，在模型边界清晰的情况下，业务模型是可稳定的。其中Getter作为对外状态读取，Action作为队内操作接口，即**状态消费是只读的，状态操作只能通过Action**。

单一状态树的弊端是，应用的所有状态会集中到一个对象中，随着项目的迭代store对象可能相当臃肿。这种持续恶化现象，表面原因是状态定义代码和状态使用代码的物理距离较远，业务代码修改时不能及时的更新状态定义代码；深层次原因是状态的业务模型边界不清晰、作用域存在业务粒度上存在不匹配：
1. 模型边界是个关键问题，不同业务方向的代码切莫混杂在一起；
2. 模型作用域是个痛点问题，在全局设置的位置存放全局父级领域问题，可被各子领域共用的组件，切莫把子领域中的状态代码也放到全局领域中造成爆炸。

Store从字面上看，就是一个Database，数据库中包含了关系，Store中也隐藏了关系，按Database的范式理论来设计Store——梳理实体之间的关系，以保持实例的数据一致性。
另外，Store和Database之间的区别在于Database中更侧重于实体，接近于纯实体和实体关系；而前台的Store中可能同时包含了部分跟UI视图相关联的视图状态——本质上是应用程序的状态。

Store范式设计，即在Flux/Redux/Vuex中的State部分用数据范式的思路设计Store，启发辅助我们设计合理性的模型边界和作用域。

### 1.1 关系数据库范式
关系数据库范式（Normal Form，缩写为NF）作为数据库表设计的标准范式，其最大的意义就是为了**避免数据的冗余和插入、删除、更新的异常**。基本概念如下：
1. 第一范式：**原子字段**
    1. 所有字段（属性）均有**原子性**，是最小的单元，不可再分割；

2. 第二范式：**主键依赖**；满足1NF
    1. 如果依赖于主键，则需要所有相关字段都依赖于主键，不能存在部分字段不依赖主键的情况；
    2. 如果存在不相关的字段，将其分类后分别放在单独表里面，通过外键依赖；

3. 第三范式：**消除冗余**；满足2NF
    1. 不重复存储相同的信息，即一张数据库表中不包含已在其它表中已包含的非主关键字信息；
    2. 要消除传递依赖（冗余）；
    3. 非主键外的所有字段必须互不依赖；
    4. 并查集里面的路径压缩；
    5. 个人理解：将同一张表中隐藏的实体关系拆解为实体关系表；

4. ...


### 1.2 API的分析
后端输出的API，已经是根据业务场景简化后的API，比如列表和详情两个API，从模型实体关系上梳理，前者中的实体是后者实体的一个子集，两者都是真实完整实体中的子集。

但在业务使用中，大多数情况下是先有用前者获取列表，链接进去看详情页面——此时已经可以用前者获取到的子集字段来显示以提高用户的感知性能了。在这个典型案例下，需要从实体集合的角度设计Store。


### 1.3 Store的详细设计
#### 1. 全局实体集合
模型集合是模型的本质，从全局的角度讲，实体一定是集合的，以此作为整个Store设计的出发点。全局实体集合仅包含全应用层次公用的数据，比如用户信息、博客中的文章列表等。
在数据量不大（1000之内）的情况下，使用Array作为数据的载体（便于Vue中的响应式数据操作的方法）。


#### 2. 模块实体集合
模块是Vuex中Store拆分的一种形式，跟业务粒度保持一致即可——比如子频道，页面较多或实体较多时，进一步拆分建议如下。


#### 3. 基本操作CRUD的形式
1. 增，单独的业务逻辑操作，操作完成后插入到对应的实体列表中；
2. 删，单独的业务逻辑操作，操作完成后删除对应的实体列表中的实体；
3. 查，独立的getter方法，以id作为基本的数据查询依据；
4. 改，同增和查，先查后增；


#### 4. Store中实体和Database中实体的映射
1. 基于互联网的使用方式，Store中的实体基本上是惰性的，用的时候才取，用完之后缓存，页面销毁后消失；
2. 当实体的稳态性较好时，从优化的角度，可以将Store持久化在浏览器中；
3. 根据业务的需求，可以预取一部分数据，以提高前端的响应性能。


## 二、Store实践

### 2.1 原则
1. **如无必要，切勿使用；如需使用，务必简洁**；
2. 模型边界清晰，充分使用正交分解；
3. 模型作用域最小化，尽可能减少对全局Store的侵入，优先使用业务模块级别（使用namespace 隔离各个功能状态）；
4. 保持单向数据流——**状态消费是只读的，状态操作只能通过Action**。
5. 从模型属性衍生出的视图模型属性，使用computed（getter）表达。

### 2.2 规范
1. `strict`设置为`true`；
2. `namespace`设置为`true`；
3. `mapGetters`和`mapActions`命名空间名称字符串和路由规则保持一致。

### 2.3 案例
1. 业务模块使用案例

**下面案例仅为模块的声明和注册、销毁、使用的演示作用，不建议在生产中把这么简单的模块还要拆分和动态引用，单一组件内完成挺好的**——间接的才是最好的。

状态模块声明如下，放置在module文件夹中，注意`state`属性赋值为函数，确保模块重复注入时，不受上次数据的影响。
```js
import ApiService from '@/common/services/api';
import { SET_AUTH } from '@/store/mutationsType';

export const LOGIN = 'login';
export const NAMESPACE = 'login';

const SET_ERROR = 'setError';

const actions = {
  [LOGIN](context, credentials) {
    return new Promise(resolve => {
      ApiService.post('users/login', { user: credentials })
        .then(({ data }) => {
          context.commit(SET_AUTH, data.user, { root: true });
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data.errors);
        });
    });
  },
};

const mutations = {
  [SET_ERROR](state, error) {
    state.errors = error;
  },
};

export default {
  namespaced: true,
  state: () => ({
    errors: null,
  }),
  actions,
  mutations,
};
```

视图使用部分代码如下，业务模块级别的状态在业务模块的`App.vue`中注入和销毁，注意模块的注入和销毁要成对出现：
```js
<script>
import { mapState } from 'vuex';
import module, { NAMESPACE, LOGIN} from './module';

export default {
  name: 'App',
  data() {
    return {
      email: null,
      password: null,
    };
  },
  computed: {
    ...mapState(NAMESPACE, {
      errors: state => state.errors,
    }),
  },
  beforeCreate() {
    this.$store.registerModule(NAMESPACE, module);
  },
  destroyed() {
    this.$store.unregisterModule(NAMESPACE);
  },
  methods: {
    onSubmit(email, password) {
      this.$store
        .dispatch(`${NAMESPACE}/${LOGIN}`, { email, password })
        .then(() => this.$router.push({ name: 'home' }));
    },
  },
};
</script>

```


## 三、其他状态相关实践
### 3.1 Prop
`Prop`的两个核心特征是：只读属性、单向数据流。

### 3.2 Data
`Data`是Vue中唯一可直接写的状态，接受数据输入的唯一载体。

### 3.3 Computed
在Vue中，计算属性的初衷是为了优化模板中的复杂表达式计算，以让模板的声明式表达保持简洁，比如下面案例：
```html
<template>
  <p>{{ fullName }}</p>
</template>
<script>
computed: {
  fullName: function () {
    return this.firstName + ' ' + this.lastName
  }
}
</script>
```

计算属性本质上是**只读**的`getter`，单向依赖于`prop`、`data`和其他`computed`，虽然可以通过`setter`的形式，让计算属性有**可写**的能力，但这样会破坏逻辑上的单项数据流造成循环依赖。

### 3.4 Watch
Watch是Vue中上游数据`props`、`mapGetters`、`$router`发生变化后的，用于处理副作用，常见使用场景：
1. 监听上游数据变化后发起新的Ajax请求；
2. 监听`props`/`mapGetters`变化后对内部的`data`进行初始化赋值——此时从全局看，Store中的状态是稳态的用于存储，`data`中的数据是敏态的用于编辑，编辑&校验完成后用`action`进行更新操作；
3. ……

常见Watch使用不恰当的例子：
1. 监听`props`变化，更新用于模板显示的`data`——此时用计算属性更合适；
2. 监听`props`变化，控制当前组件的显示和隐藏——此时在父组件中用`v-if`更合适；
3. 监听`v-model`/`data`的变化，发起新的Ajax——此时在子组件中用`$emit`更合适。


## 十、参考
1. [解释一下关系数据库的第一第二第三范式？](https://www.zhihu.com/question/24696366)
