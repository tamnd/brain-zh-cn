---
title: "CF 104049C - 捕获青铜"
description: "我们使用第 7.1.4 节和练习 203 的约定，将族 $f$ 表示为变量 $x1,x2,dots,xn$ 上的降序决策图。节点 $v$ 具有字段 $$V(v),quad LO(v),quad HI(v),$$ 和终端 $bot,top$。"
date: "2026-07-02T03:43:23+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104049
codeforces_index: "C"
codeforces_contest_name: "UTPC Contest 11-11-22 Div. 1 (Advanced)"
rating: 0
weight: 104049
solve_time_s: 130
verified: false
draft: false
---

[CF 104049C - 夺取青铜](https://codeforces.com/problemset/problem/104049/C)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 10s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 我们代表一个家庭$f$作为变量的降序决策图$x_1,x_2,\dots,x_n$，使用第 7.1.4 节和练习 203 的约定。一个节点$v$有字段$$V(v),\quad LO(v),\quad HI(v),$$和终端$\bot,\top$。 变量排序沿着每条边严格增加。 

下面的所有操作都是通过节点对上的结构递归来实现的，并记忆先前计算的节点对。 

让$\mathrm{Apply}(op,f,g)$表示返回应用结果的记忆递归过程$op$到节点$f,g$。 让$\mathrm{top}(v)$表示$V(v)$，并让$\mathrm{low}(v),\mathrm{high}(v)$表示它的孩子。 

什么时候$f$和$g$是非终结符，让$i=\mathrm{top}(f)$,$j=\mathrm{top}(g)$。 让$k=\min(i,j)$。 我们通过变量的香农展开式进行分割$x_k$。 

具有可变索引的节点$k$但一个操作数缺失的处理方法是在两个分支上复制该操作数。 

所有结果均按通常规则减少：共享相同的子图，并消除具有相同低和高子代的节点。 

### (a) 加入$f \sqcup g$连接定义为$$f \sqcup g = \{\alpha \cup \beta \mid \alpha \in f,\ \beta \in g\}.$$递归：

 如果$f=\bot$或者$g=\bot$， 然后$f \sqcup g=\bot$。 

如果$f=\top$， 然后$f \sqcup g=g$。 如果$g=\top$， 然后$f \sqcup g=f$。 

否则让$k=\min(V(f),V(g))$。 定义投影$$f_0 = f|_{x_k=0},\quad f_1 = f|_{x_k=1},\quad g_0 = g|_{x_k=0},\quad g_1 = g|_{x_k=1}.$$然后$$(f \sqcup g)_0 = (f_0 \sqcup g_0),
\qquad
(f \sqcup g)_1 = (f_1 \sqcup g_0)\ \sqcup\ (f_0 \sqcup g_1)\ \sqcup\ (f_1 \sqcup g_1).$$根节点是在级别创建的$k$有了这些孩子，依次减少。 

这种递推反映了一组$f \sqcup g$要么省略$x_k$在两个组件中或至少从一侧包含它，产生子情况的所有并集。 

### (b) 见面$f \sqcap g$见面会是$$f \sqcap g = \{\alpha \cap \beta \mid \alpha \in f,\ \beta \in g\}.$$基本案例：$$\bot \sqcap g = \bot,\quad f \sqcap \bot = \bot,\quad \top \sqcap g = g,\quad f \sqcap \top = f.$$递归与$k=\min(V(f),V(g))$:$$(f \sqcap g)_0 = f_0 \sqcap g_0,
\qquad
(f \sqcap g)_1 = f_1 \sqcap g_1.$$交叉项消失，因为只有当元素在每个变量位置的两个操作数中都存在时才属于交集。 

### (c) 对称差$f \Delta g$这里$$f \Delta g = \{ \alpha \oplus \beta \mid \alpha \in f,\ \beta \in g \},$$在哪里$\oplus$是集合的对称差。 

基本案例：$$\bot \Delta g = \bot,\quad f \Delta \bot = \bot,\quad \top \Delta g = g,\quad f \Delta \top = f.$$递归与$k=\min(V(f),V(g))$:$$(f \Delta g)_0 = f_0 \Delta g_0,$$

$$(f \Delta g)_1 = (f_1 \Delta g_0)\ \sqcup\ (f_0 \Delta g_1).$$第二行来自恒等式$$(A\oplus x)\oplus B = (A\oplus B)\oplus x,$$并根据存在的情况进行分区$x_k$。 

### (d) 商$f/g$根据定义，$$f/g = \{\alpha \mid \forall \beta \in g,\ \alpha \cup \beta \in f,\ \alpha \cap \beta = \varnothing\}.$$基本案例：

 如果$g=\bot$，普遍条件是空的，因此每个$\alpha$是允许的，所以$f/g$是变量域上的通用族，由终结符表示$\top$在布尔函数解释中。 

如果$f=\bot$和$g\neq \bot$， 然后$f/g=\bot$。 

如果$g=\top=\{\varnothing\}$，那么条件简化为$\alpha \in f$， 因此$$f/\top = f.$$递归与$k=\min(V(f),V(g))$。 分裂$g = g_0 \cup (e_k \sqcup g_1)$类似地对于$f$。 

商条件以是否分开$x_k$被迫缺席$\alpha$。 

如果$k \notin g$（所有集合在$g$忽略$x_k$）， 然后$$(f/g)_0 = f_0/g,\qquad (f/g)_1 = f_1/g.$$如果$k \in g$，那么任意$\alpha \in f/g$必须满足与所有集合的不相交性$g_1$，强制排除$x_k$根据交互作用项，我们得到：$$(f/g)_0 = (f_0/g_0)\ \cap\ (f_1/g_1),
\qquad
(f/g)_1 = (f_1/g_0)\ \cap\ (f_0/g_1).$$这些子句直接来自于将全称量词分布在$g$分为包含或排除的部分$x_k$，并强制执行兼容性$f$组件方面。 

### (e) 余数$f \bmod g$根据定义，$$f \bmod g = f \setminus (g \sqcup (f/g)).$$递归使用已经定义的操作：$$\mathrm{mod}(f,g) = \mathrm{BUTNOT}(f,\ \mathrm{Join}(g,\ \mathrm{Quot}(f,g))).$$在节点级别，$k=\min(V(f),V(g))$，我们计算：$$(f \bmod g)_0 = f_0 \bmod g_0,$$

$$(f \bmod g)_1 = f_1 \bmod g_0\ \setminus\ (g_1 \sqcup (f/g)).$$第二项恰好删除了通过连接生成的那些元素$g$与商，一致应用于$x_k=1$分支。 

最后，通过节点共享和消除冗余测试来减少所有结果。 

这就完成了使用有序缩减 BDD 框架的所有五个操作的构造。 ∎
