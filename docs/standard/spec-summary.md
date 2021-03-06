---
title: 规范概述
sidebar_label: 规范概述
---

## 一、概述

规范包含“规”和“范”两部分，“规”是规定，由团队、个人在过去一线工作中积累的经验总结而成——或成功的因素，或失败的教训，总结成信条服务于后来者；“范”是范例，是对“规”从正反两方面的明确阐述，使规范的使用者清晰理解、使用和思考——其中思考是最重要的，结合当前工作的新环境因素、新业务因素，对“规”和“范”做的进一步总结和优化——以复利化放大价值。旨在提高合作和代码质量，并使其支持基础架构，和工具的良好兼容，比如CSS/JavaScript混淆、压缩和合并。

简单说：规范是*过去经验*对*当今工作*的价值贡献，这是规范随着时间不断迭代更新的根因，将规范仓库完全开放给集团所有伙伴们，一起共建：
1. **若无规范总结规范**；
2. **若有规范使用规范**；
3. **若规范不合适，思考后优化规范**。

假设一个项目没有统一的编码规范，就很容易造成项目代码的混乱。造成的困扰包括但不限于：
1. 合并的时候经常出现无意义的冲突，导致代码合并快不起来；
2. 代码的可读性受到影响，尤其是对项目可扩展性影响更加明显；
3. 容易造成各种各样本应该避免的错误。

一个团队没有统一的编码规范，就不利于成员在项目之间较顺畅地流动和支援，也使得每个团队成员难以形成固定的编码风格习惯，成员工作的专业性也受到影响。你可能想去改变这种现状，然而却苦于缺乏依据，加之项目工期紧迫，又没有经历去系统梳理，所以你只能被动忍受。长此以往，忍受不了的，离开了；泄气的，放弃了，选择随波逐流。但其实我们还有一种选择，就是改变。

进一步，规范需要贴合社区/业界，规范需要工具链的整合支持，以避免成为一纸空文。对规范进行了较为贴合社区最佳实践的梳理，持续沉淀出基于最佳实践的自动化工具链、工作流和最终的工程体系。


## 二、原则
制定规范需要遵循的原则如下：
1. 一致性原则
2. 只包含不可变的规则，而不是笼统地说明；
3. 总是把规则提炼成最简单的表达；
4. 总是首先说明规则是什么，再说明“如果不这样，那么会如何”；
5. 每个规则必须包含以下词中的一个——总是、永远不要、只有、每一个、不要、要；
6. 工具化、自动化、工程化，即每一条规范都有对应的工具来保障执行，每一个工具的执行都是自动化运行的，每一个自动化运行都可以嵌套到工作流程中实现工程化。


## 三、展望

### 3.1工具化
持续完善相应规范和相应工具匹配，来提升易用性，便于快速地给项目添加规范和工具。


### 3.2工程化
在实践中持续地优化完善，迭代成规范和工程化体系，例如：

1. 针对分支规范进行校验；
2. 安全性规范；
3. 性能和用户体验规范；
4. 探索如何利用Echo、朱雀、AB测平台、Gaia大前端UI自动化测试平台等的能力；
