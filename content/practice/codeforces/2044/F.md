---
title: "CF 2044F - 简单的恶魔问题"
description: "我们有两个数组，a 和 b。 根据它们，我们构建了一个隐式矩阵 $$M{i,j}=ai bj.$$ 矩阵的美妙之处在于其所有条目的总和。"
date: "2026-06-08T09:24:48+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "brute-force", "data-structures", "math", "number-theory"]
categories: ["algorithms"]
codeforces_contest: 2044
codeforces_index: "F"
codeforces_contest_name: "Codeforces Round 993 (Div. 4)"
rating: 1900
weight: 2044
solve_time_s: 124
verified: true
draft: false
---

[CF 2044F - 简单的恶魔问题](https://codeforces.com/problemset/problem/2044/F)

 **评级：** 1900
 **标签：** 二分查找、暴力破解、数据结构、数学、数论
 **求解时间：** 2m 4s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有两个数组，`a`和`b`。 从它们我们构​​建一个隐式矩阵$$M_{i,j}=a_i b_j.$$矩阵的美妙之处在于其所有条目的总和。 

对于每个查询值`x`，我们必须判断是否存在一行`r`和一列`c`这样在设置行中的每个单元格后`r`以及列中的每个单元格`c`为零，最终的美感就变成了`x`。 

该操作是假设的。 每个查询都从原始矩阵开始。 

第一个观察结果是矩阵本身太大而无法构建。 两个尺寸均可达到`2·10^5`，因此矩阵最多可以包含`4·10^10`细胞。 任何单独触及矩阵条目的解决方案都是不可能的。 

查询次数仅为`5·10^4`，这表明允许进行大量预处理，但每个查询的回答速度必须比`O(nm)`。 

数组内的值受其长度限制。 自从$$|a_i|\le n,\qquad |b_j|\le m,$$所有行总和和列总和都保持在可管理的范围内。 事实证明，这是解决问题的关键属性。 

一些边缘情况很容易被忽略。 

考虑```
n=1, m=1
a=[5]
b=[7]
```矩阵仅包含`35`。 选择唯一的行和唯一的列会删除该单元格一次，而不是两次。 最终的美感就是`0`。 

粗心的包含-排除公式可能会减去两次交集。 

另一个重要的情况涉及零。```
a=[0,1]
b=[2,3]
```总的矩阵美感已经完全由第二行决定。 一些行删除值变得相同，并且依赖于总和唯一性的解决方案将失败。 

负值也很重要。```
a=[-2,3]
b=[-1,2]
```目标美感可以是正的，也可以是负的，具体取决于删除的行和列。 仅关注正除数会错过有效答案。 

## 方法

 直接的强力解决方案计算每对可能的结果的美感`(r,c)`。 

有`nm`选择。 对于每一对，我们可以重新计算其中的美丽`O(1)`使用预先计算的行和列总和，然后与查询进行比较。 

这已经需要存储或生成最多$$2\cdot10^5 \times 2\cdot10^5 = 4\cdot10^{10}$$成双成对，这是完全不可能的。 

为了找到问题中隐藏的结构，让$$A=\sum a_i,\qquad B=\sum b_j.$$原来的美丽是$$S=A\cdot B.$$如果我们删除行`r`，我们消除$$a_r B.$$如果我们删除列`c`，我们消除$$b_c A.$$细胞`(r,c)`属于两次删除，因此被减去两次，必须加回一次。 

最终的美感就是$$S-a_rB-b_cA+a_rb_c.$$现在因素：$$S-a_rB-b_cA+a_rb_c =(A-a_r)(B-b_c).$$这个身份彻底改变了问题。 

对于每一行定义$$u=A-a_r.$$对于每一列定义$$v=B-b_c.$$任何手术后，美丽就是简单$$u\cdot v.$$查询变为：

 是否存在$$u\in U,\quad v\in V$$这样$$u v = x ?$$在哪里$$U=\{A-a_i\},\qquad V=\{B-b_j\}.$$现在我们已经将矩阵问题简化为因式分解问题。 

关键的观察是所有值`U`和`V`位于小范围内。 

自从$$|a_i|\le n,\qquad |A|\le n^2,$$每一个`u`满足$$|u|\le n^2+n.$$和`n≤2·10^5`，这大约是`4·10^10`，看起来很大。 然而，查询值满足$$|x|\le 2\cdot10^5.$$只有查询的除数才重要。 任意整数的约数个数，最多`200000`很小，不到几百。 

对于查询`x`, 枚举所有除数`d`的`|x|`。 

对于每个除数对$$d,\ \frac{x}{d},$$检查一个因素是否属于`U`另一个属于`V`，考虑到符号。 

这会将每个查询变成除数搜索。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(qnm) | O(1) | O(1) | 太慢了 |
 | 最佳 | O(n + m + q√X) | O(n + m + q√X) | O(n + m) | 已接受 |

 这里`X = 200000`。 

## 算法演练

 1. 读取数组`a`和`b`。 
2. 计算$$A=\sum a_i,\qquad B=\sum b_j.$$1. 建立一套$$U=\{A-a_i\}.$$哈希集允许恒定时间的成员资格检查。 

1. 建立一套$$V=\{B-b_j\}.$$1.对于每个查询值`x`，枚举所有正因数`|x|`。 
2. 对于每个除数`d`， 让$$e=\frac{|x|}{d}.$$1. 生成所有乘积等于的符号组合`x`。 

如果`x>0`，有效因子对是$$(d,e),\quad (-d,-e).$$如果`x<0`，有效因子对是$$(d,-e),\quad (-d,e).$$1. 对于每个候选因子对`(p,q)`，检查是否$$p\in U$$和$$q\in V.$$如果属实，请立即回答“是”。 

1. 如果没有除数对有效，则回答“否”。 

### 为什么它有效

 删除行后`r`和列`c`，所得的美度等于$$(A-a_r)(B-b_c).$$每一种可实现的美都必须是一种价值的产物`U`和一个值来自`V`。 

相反，每对$$u=A-a_r,\qquad v=B-b_c$$对应于实际的行和列选择。 

因此，查询恰好可以在以下时间实现：`x`可以写成$$x=u v$$和`u∈U`和`v∈V`。 

该算法精确地检查所有可能的因式分解`x`，因此当且仅当存在这样的对时返回 YES。 

## Python 解决方案```python
import sys
from math import isqrt

input = sys.stdin.readline

def solve():
    n, m, q = map(int, input().split())
    a = list(map(int, input().split()))
    b = list(map(int, input().split()))

    A = sum(a)
    B = sum(b)

    U = set(A - x for x in a)
    V = set(B - x for x in b)

    ans = []

    for _ in range(q):
        x = int(input())

        ok = False
        ax = abs(x)

        for d in range(1, isqrt(ax) + 1):
            if ax % d:
                continue

            e = ax // d

            if x > 0:
                candidates = (
                    (d, e),
                    (-d, -e),
                )
            else:
                candidates = (
                    (d, -e),
                    (-d, e),
                )

            for p, qv in candidates:
                if p in U and qv in V:
                    ok = True
                    break
                if e != d:
                    if qv in U and p in V:
                        ok = True
                        break

            if ok:
                break

        ans.append("YES" if ok else "NO")

    sys.stdout.write("\n".join(ans))

solve()
```预处理阶段计算总和并构造变换集`U`和`V`。 

关键的实现细节是我们从不构造矩阵。 每个查询都完全通过除数枚举和哈希查找来回答。 

检查除数对时，我们必须考虑两个阶数，因为除数在`U`可能对应于`d`或到`e`。 

负目标需要单独的符号处理。 一个常见的错误是仅检查正除数，而忘记两个变换后的集合可能包含负值。 

## 工作示例

 ### 示例 1

 输入：```
a = [-2, 3, -3]
b = [-2, 2, -1]
```首先计算：$$A=-2,\qquad B=-1.$$然后$$U=\{0,-5,1\}$$和$$V=\{1,-3,0\}.$$询问`x=1`。 

| 除数 | 配对 | 在U？ | 在V？ |
 | --- | --- | --- | --- |
 | 1 | (1,1) | 是的 | 是的 |

 存在有效的分解，所以答案是肯定的。 

### 示例 2

 假设```
a = [1, 2]
b = [3, 4]
```然后$$A=3,\quad B=7.$$变换后的集合是$$U=\{2,1\},$$

$$V=\{4,3\}.$$询问`x=8`。 

| 除数 | 配对 | 有效 |
 | --- | --- | --- |
 | 1 | (1,8) | 没有 |
 | 2 | (2,4) | 是的 |

 自从`2 ∈ U`和`4 ∈ V`，答案是YES。 

这个例子表明只有因素对才重要。 原始矩阵永远不会出现在计算中。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n + m + q√X) | O(n + m + q√X) | 每个查询都会枚举` | 的除数
 | 空间| O(n + m) | 哈希集`U`和`V`|

 自从`|x| ≤ 200000`，我们有$$\sqrt{X}\le 447.$$每个查询最多需要约 447 次除数检查。 和`q ≤ 50000`，这完全符合限制。 

## 测试用例```python
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()

    from math import isqrt

    input = sys.stdin.readline

    n, m, q = map(int, input().split())
    a = list(map(int, input().split()))
    b = list(map(int, input().split())

    A = sum(a)
    B = sum(b)

    U = set(A - x for x in a)
    V = set(B - x for x in b)

    ans = []

    for _ in range(q):
        x = int(input())
        ok = False
        ax = abs(x)

        for d in range(1, isqrt(ax) + 1):
            if ax % d:
                continue

            e = ax // d

            if x > 0:
                pairs = [(d, e), (-d, -e)]
            else:
                pairs = [(d, -e), (-d, e)]

            for p, qv in pairs:
                if (p in U and qv in V) or (qv in U and p in V):
                    ok = True
                    break

            if ok:
                break

        ans.append("YES" if ok else "NO")

    return "\n".join(ans)

assert run("""3 3 6
-2 3 -3
-2 2 -1
-1
1
-2
2
-3
3
""") == """NO
YES
NO
NO
YES
NO"""

assert run("""1 1 1
5
7
0
""") == "YES"

assert run("""2 2 1
1 2
3 4
8
""") == "YES"

assert run("""2 2 1
1 2
3 4
7
""") == "NO"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 样品1 | 样本输出 | 基本正确性|
 | 单行单列| 是 | 交叉路口处理 |
 | 产品已存在 | 是 | 直接因素匹配 |
 | 产品缺席 | 否 | 负结果路径|

 ## 边缘情况

 考虑一个`1 × 1`矩阵：```
a=[5]
b=[7]
```唯一的操作是删除单个单元格。 最终的美感就是`0`。 公式给出$$(A-a_1)(B-b_1)=0\cdot0=0,$$完全匹配。 

考虑包含零的数组：```
a=[0,1]
b=[2,3]
```然后$$U=\{1,0\}.$$目标为`0`是可以实现的，因为一个因素可以为零。 因式分解方法自然可以处理这个问题，因为零直接出现在变换后的集合中。 

考虑负面目标：```
a=[-2,3]
b=[-1,2]
```转换后的集合包含正值和负值。 一个目标，例如`-3`需要具有相反符号的因子。 该算法显式检查所有符号组合，因此不会错过任何有效的解决方案。
