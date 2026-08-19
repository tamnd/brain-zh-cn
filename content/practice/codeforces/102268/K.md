---
title: "CF 102268K - 知识"
description: "我们有 a 和 b 上的二进制字符串。 允许的操作插入或删除三个特殊块之一：aa、bbb 或 ababab。 由于每个操作都可以通过执行相应的插入或删除来反转，因此这些操作定义了字符串的等价类。"
date: "2026-08-19T04:45:40+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102268
codeforces_index: "K"
codeforces_contest_name: "300iq Contest 1"
rating: 0
weight: 102268
solve_time_s: 751
verified: false
draft: false
---

[CF 102268K - 知识](https://codeforces.com/problemset/problem/102268/K)

 **评级：** -
 **标签：** -
 **求解时间：** 12m 31s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一个二进制字符串`a`和`b`。 允许的操作插入或删除三个特殊块之一：`aa`,`bbb`， 或者`ababab`。 由于每个操作都可以通过执行相应的插入或删除来反转，因此这些操作定义了字符串的等价类。 任务是确定有多少个长度精确的不同字符串`x`与给定字符串属于同一等价类`s`。 

约束被故意划分为大的输入字符串和巨大的目标长度。 原始字符串可以包含 300,000 个字符，因此处理它本质上必须是线性的。 同时，`x`可以是`10^9`，它排除了任何按长度索引的动态编程以及对目标字符串的每个字符执行一次转换的任何模拟。 一秒的时间限制使得对原始字符串进行适度的超线性工作也是不可取的，因此主要的挑战是将等价关系压缩为恒定数量的状态。 官方声明给出`n <= 300000`,`x <= 10^9`，以及一秒的时间限制。 

有几种边缘情况暴露了常见的错误解释。 如果输入是```
1
a
0
```答案是`0`。 目标是空字符串，但是`a`不能减少，因为两者都没有`aa`,`bbb`，也不`ababab`发生。 仅查看长度差异的粗心实现可能会错误地假设删除两个字符总是可能的。 

为了```
2
aa
0
```答案是`1`，因为给定的字符串可以直接减少为空字符串。 这还检查是否允许零操作以及长度`0`是一个合法的目标。 

为了```
3
bbb
2
```答案是`1`。 源字符串表示与空字符串相同的等价类，因为`bbb`可以删除，并且只能在长度为2的字符串中删除`aa`代表该类。 仅跟踪可能长度的解决方案会忽略字母的实际排列很重要的事实。 

关系`ababab = empty`也与较短的两个关系无关。 为了```
6
ababab
3
```源相当于空字符串，该类中唯一长度为三的字符串是`bbb`，所以答案是`1`。 忽略六字符关系会错误地将源分类为非空。 这些例子说明了为什么问题是关于单词的等价类，而不是简单地可以达到哪些长度。 

## 方法

 直接的方法是枚举每个长度的二进制字符串`x`，测试是否可以转化为`s`，并统计成功的数量。 正好有`2^x`候选字符串，因此即使在检查等效性之前，最坏的情况也需要`2^x`候选人。 和`x = 10^9`，这是完全不可行的。 另一种自然的暴力方法是执行所有可能的插入和删除，但这甚至不太有用，因为插入会使中间字符串任意长。 

蛮力之所以有效，是因为每个操作都准确地保留了我们关心的等价关系。 失败之处在于字符串本身是巨大的对象，而关系的结构比其原始表示所暗示的要多得多。 

关键的观察是这三个关系可以用代数形式写为`a² = 1`,`b³ = 1`， 和`(ab)³ = 1`。 

这些正是四面体旋转对称群（交替群）的定义关系`A4`。 该组只有 12 个元素。 同样，所有字符串正好分为 12 个等价类。 这些类的一组常见代表是空字符串，`a`,`b`,`ab`,`ba`,`bb`,`aba`,`abb`,`bab`,`bba`,`babb`， 和`bbab`。 这种12态结构也是该问题标准解决方案的基础。 

我们可以通过将这两个字母表示为四个顶点的排列来使观察完全具体。 让`a`是排列`(0 1)(2 3)`并让`b`是`(1 2 3)`。 两者都是偶数排列，所以它们位于`A4`。 他们满足`a² = 1`,`b³ = 1`， 和`(ab)³ = 1`，并且它们生成了所有 12 个元素`A4`。 

因此，评估一个字符串意味着乘以相应的排列。 当两个字符串求值为同一组元素时，它们完全相同。 附加任一`a`或者`b`然后成为这 12 个状态中的两个状态之间的过渡。 

从空字符串开始，每个长度的二进制字符串`x`正好对应于步行`x`这个 12 状态自动机中的转换。 我们只需要计算有多少这样的游走在由 表示的组元素处结束`s`。 自从`x`可以是`10^9`，矩阵求幂给出了走入的次数`O(12^3 log x)`时间。 

原始字符串被处理一次以找到其组元素，从而给出总复杂度`O(n + 12^3 log x)`。 在该问题的已知解决方案中描述了相同的恒定状态矩阵方法。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |`O(2^x)`候选人，加上等效性检查| 指数| 太慢了 |
 | 最佳|`O(n + 12^3 log x)`|`O(12^2)`| 已接受 |

 ## 算法演练

 1. 用四个元素的排列来表示每个字母。 使用`a = (0 1)(2 3)`和`b = (1 2 3)`。 排列存储为其四个图像的元组，因此排列组合可以通过四个数组访问来实现。 

所选择的排列满足三个允许的关系。 由于它们生成四个元素的所有偶数排列，因此可以达到 12 个群状态。 
2. 从恒等排列开始，通过广度优先搜索生成 12 个群元素。 从每个已知状态乘以`a`并由`b`。 存储每个新发现的排列并为其分配一个状态索引。 

生成状态而不是硬编码它们的名称使得实现独立于特定的简化字符串列表。 唯一需要的事实是生成的组有 12 个元素。 
3. 计算输入字符串对应的状态`s`。 从恒等式开始，乘以与每个字符相关的排列。 

这需要`O(n)`时间并将整个原始字符串减少到仅有 12 种可能状态之一。 
4. 建立一个`12 x 12`转移矩阵`M`。 放`M[i][j]`移动组状态的字母数`i`到组状态`j`。 

每个状态只有两个传出转换，一个用于追加`a`和一个用于附加`b`。 如果两个字母碰巧导致相同的状态，则相应的矩阵条目变为`2`。 
5. 计算`M^x`使用二进制求幂。 对于任何州`u`和`v`, 条目`(M^x)[u][v]`是长度的数量-`x`开头的字符串`u`并结束于`v`。 

我们从身份状态开始，因为每个二进制字符串都是通过将其字符附加到空字符串来构造的。 
6.让`target`是的状态`s`并让`identity`为空串状态。 所需答案是`(M^x)[identity][target]`，取模`998244353`。 

这根据字符串的实际字母顺序来计算字符串，而不仅仅是根据它们的端点。 矩阵乘法分别计算每个不同的转换序列。 

为什么它有效：每个允许的插入或删除都会保留组元素，因为每个插入或删除的块都会评估身份。 相反，关系`a² = b³ = (ab)³ = 1`精确给出 12 元素四面体群，因此当两个二进制字符串表示相同的群元素时，它们可以通过允许的操作精确连接。 转换矩阵精确记录附加一个字符如何改变该元素。 因此，每个长度`x`等价类中的字符串`s`对应一个长度-`x`从身份状态步行到`target`，并且每一个这样的遍历都对应于该类中的一个二进制字符串。 因此，算法计算出的矩阵条目正是所需的计数。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 998244353
K = 12

def compose(p, q):
    # p after q: (p o q)(i) = p(q(i))
    return (
        p[q[0]],
        p[q[1]],
        p[q[2]],
        p[q[3]],
    )

def build_group():
    identity = (0, 1, 2, 3)

    # a = (0 1)(2 3)
    a = (1, 0, 3, 2)

    # b = (1 2 3)
    b = (0, 2, 3, 1)

    generators = (a, b)

    states = [identity]
    index = {identity: 0}

    head = 0
    while head < len(states):
        cur = states[head]
        head += 1

        for g in generators:
            nxt = compose(cur, g)
            if nxt not in index:
                index[nxt] = len(states)
                states.append(nxt)

    return states, index, generators

def mat_mul(a, b):
    c = [[0] * K for _ in range(K)]

    for i in range(K):
        ci = c[i]
        ai = a[i]

        for k in range(K):
            x = ai[k]
            if x == 0:
                continue

            bk = b[k]
            for j in range(K):
                ci[j] = (ci[j] + x * bk[j]) % MOD

    return c

def mat_pow(a, e):
    result = [[0] * K for _ in range(K)]
    for i in range(K):
        result[i][i] = 1

    while e:
        if e & 1:
            result = mat_mul(result, a)
        a = mat_mul(a, a)
        e >>= 1

    return result

def solve():
    n = int(input())
    s = input().strip()
    x = int(input())

    states, index, generators = build_group()
    identity = states[0]

    a, b = generators

    transition = [[0] * K for _ in range(K)]

    for i, state in enumerate(states):
        to_a = index[compose(state, a)]
        to_b = index[compose(state, b)]

        transition[i][to_a] += 1
        transition[i][to_b] += 1

    target = identity
    for ch in s:
        if ch == 'a':
            target = compose(target, a)
        else:
            target = compose(target, b)

    target_index = index[target]
    powered = mat_pow(transition, x)

    print(powered[0][target_index] % MOD)

if __name__ == "__main__":
    solve()
```这`compose`函数使用约定`p`后`q`， 所以`compose(cur, generator)`表示在当前单词的右侧添加一个新字母。 确切的约定并不重要，只要它一致地用于状态生成、过渡构建和评估`s`。`build_group`从恒等式开始，重复应用两个生成器。 这三个定义关系保证只出现 12 个状态。 BFS 在发现这 12 个排列后终止。 

转换矩阵使用当前状态的行和下一状态的列。 由于每个状态都有两个可能的下一个字符，因此每行的总权重为 2。 矩阵幂保留相同的解释：`M^k[i][j]`计算长度的数量-`k`字符串获取状态`i`陈述`j`。 

输入字符串是单独计算的，而不是插入到矩阵过程中。 这是必要的，因为`n`只有30万，而`x`可以是十亿。 我们花费线性时间`s`，然后对数时间`x`。 

求幂循环必须从单位矩阵开始。 这处理`x = 0`自动地因为`M^0`是单位矩阵，所以答案是`1`恰好在什么时候`s`属于身份类别。 

Python整数不会溢出，而是减少每个矩阵累加模`998244353`保持中间值较小并避免不必要的增长。 该矩阵只有 12 行和 12 列，因此常数因子很小。 

## 工作示例

 对于示例 1，输入为`s = ababab`和`x = 3`。 六字关系表示`ababab`代表单位元。 矩阵计算中的相关标量是长度的数量`k`从身份回到身份。 

| 长度`k`| 正在统计的状态 |`dp[identity]`|
 | --- | --- | --- |
 | 0 | 身份| 1 |
 | 1 | 身份| 0 |
 | 2 | 身份| 1 |
 | 3 | 身份| 1 |

 长二，`aa`回到身份，因为`a² = 1`。 长三，`bbb`回到身份，因为`b³ = 1`。 结果计数为`1`，匹配样本。 

对于样品 2，`s = bbb`，所以源再次代表身份。 我们只需要两次转换后的身份到身份条目。 

| 长度`k`| 正在统计的状态 |`dp[identity]`|
 | --- | --- | --- |
 | 0 | 身份| 1 |
 | 1 | 身份| 0 |
 | 2 | 身份| 1 |

 唯一代表身份的两个长度的单词是`aa`。 这个词`bb`代表`b²`，这是一个非同一性三循环，而`ab`和`ba`也代表非同一性元素。 因此答案是`1`。 

这些迹线还验证了零长度约定。 长度为零时，仅存在空字，因此身份类恰好包含该长度的一个字。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |`O(n + 12^3 log x)`| 评估中`s`是线性的，矩阵求幂使用`O(log x)`的乘法`12 x 12`矩阵|
 | 空间|`O(12^2)`| 只有固定数量的`12 x 12`矩阵和 12 个组状态被存储 |

 最大的输入字符串只需要一次传递，因此`n = 300000`绑定很容易处理。 目标长度不会显示为循环界限，因为求幂处理其二进制表示，仅需要大约 30 个矩阵平方`x <= 10^9`。 恒定的矩阵大小使得该方法足够小，足以满足官方问题指定的一秒限制和 256 MiB 内存限制。 

## 测试用例

 以下测试工具假设上述解决方案保存为`solution.py`。 它交换`stdin`，调用实际的`solve()`函数，捕获`stdout`，然后恢复两个流。```python
# Save the editorial solution as solution.py before running this file.

import sys
import io
import solution

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        solution.solve()
        return sys.stdout.getvalue().strip()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Provided samples
assert run("6\nababab\n3\n") == "1", "sample 1"
assert run("3\nbbb\n2\n") == "1", "sample 2"
assert run("5\nbabab\n35\n") == "866826000", "sample 3"

# Minimum-size input and x = 0.
assert run("1\na\n0\n") == "0", "single a cannot reduce to empty"

# Empty string target from aa.
assert run("2\naa\n0\n") == "1", "aa reduces to empty"

# Boundary x = 1.
assert run("1\na\n1\n") == "1", "the original string itself is reachable"

# Small transition test: the only length-2 word equivalent to ab is ab.
assert run("2\nab\n2\n") == "1", "exact group-state matching"

# Maximum n and all-equal characters.
# 300000 is divisible by 2, so a^300000 is the identity.
max_input = "300000\n" + "a" * 300000 + "\n0\n"
assert run(max_input) == "1", "maximum n and all a characters"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / a / 0`|`0`| 最低限度`n`，零目标长度，非同一源 |
 |`2 / aa / 0`|`1`| 直接的`aa`取消和身份处理|
 |`1 / a / 1`|`1`| 边界目标长度和零操作可达性|
 |`2 / ab / 2`|`1`| 区分相同长度的群元素 |
 |`300000 / a...a / 0`|`1`| 最大限度`n`，全等输入，线性扫描|

 ## 边缘情况

 第一个边缘情况是`1 / a / 0`。 该算法评估`a`作为排列`(0 1)(2 3)`，所以它的目标状态与身份不同。 自从`x = 0`，矩阵幂为`M^0 = I`，以及身份到`a`条目为零。 因此输出是`0`。 

为了`2 / aa / 0`，评估这两个字母给出`a² = 1`，因此源达到恒等状态。 再次`M^0`是单位矩阵，但现在请求的状态正是起始状态。 答案是`1`，代表空字符串。 

为了`3 / bbb / 2`，源评估为`b³ = 1`。 该算法要求输入身份到身份`M²`。 有一条这样的路径，对应于`aa`，所以答案是`1`。 这捕获了将身份类与相同长度的字符串混淆的实现。 

为了`2 / ab / 2`，源状态是产品`ab`。 四个长度为2的字符串中，只有`ab`达到那个特定的状态。 因此矩阵返回`1`。 这表明该算法对等价类进行计数，而不是简单地对所有长度兼容的字符串进行计数。 

对于最大尺寸的情况`n = 300000`和`s = a`重复30万次，重复关系`aa = 1`减少每对`a`人物，留下身份。 和`x = 0`，答案是`1`。 该算法一次处理完所有 300,000 个字符，然后不执行矩阵乘法，因为指数为零，因此这种情况直接练习大输入边界和`x = 0`边界。
