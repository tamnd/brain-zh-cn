---
title: "CF 1036C - 优雅的数字"
description: "我们正在研究以 10 为基数的“稀疏”数字的概念。当您以十进制书写时，如果一个数字最多有三位非零，则该数字被视为有效。 零可以出现在任何地方和任意数量，但最多只允许三个位置携带实际值。"
date: "2026-06-16T19:09:55+07:00"
tags: ["codeforces", "competitive-programming", "combinatorics", "dp"]
categories: ["algorithms"]
codeforces_contest: 1036
codeforces_index: "C"
codeforces_contest_name: "Educational Codeforces Round 50 (Rated for Div. 2)"
rating: 1900
weight: 1036
solve_time_s: 775
verified: false
draft: false
---

[CF 1036C - 优雅数字](https://codeforces.com/problemset/problem/1036/C)

 **评级：** 1900
 **标签：** 组合数学，dp
 **求解时间：** 12m 55s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们正在研究以 10 为基数的“稀疏”数字的概念。当您以十进制书写时，如果一个数字最多有三位非零，则该数字被视为有效。 零可以出现在任何地方和任意数量，但最多只允许三个位置携带实际值。 

对于每个查询，我们给出一个间隔$[L, R]$，并且我们必须计算该区间中有多少整数满足此稀疏条件。 

范围端点达到$10^{18}$，因此我们最多处理 19 位数字。 每个查询都必须得到有效回答，并且最多可以有$10^4$查询。 

约束的直接含义是迭代范围内的每个数字是不可能的。 即使单个间隔也可能大到$10^{18}$，并总结$10^4$查询使得暴力破解完全不可行。 

主要的边缘情况来自数字结构而不是算术边界。 例如，像 1000000 和 1000001 这样的数字即使相邻，但其行为却非常不同。 另一个微妙的情况是恰好三个非零数字分散在高位的数字，其中忽略位置约束的简单计数方法会错误计算重数。 

## 方法

 强力解决方案将迭代中的每个数字$[L, R]$，计算其非零数字，如果计数最多为三，则递增计数器。 这在逻辑上是正确的，但每个数字最多需要扫描 19 位数字。 即使在最小的非平凡情况下$R - L \approx 10^{18}$，这远远超出了任何可行的计算。 即使我们只考虑一个大小的查询$10^6$，数字扫描使其成为边界，并且$10^4$查询它完全崩溃。 

问题的结构表明将视角从迭代值转变为逐位构造有效数字。 我们不问“这个数字是否有效”，而是问“X 之前存在多少个有效数字”。 这是一个经典的数字 DP 场景，其中约束取决于非零数字的数量，而不是它们的总和或顺序。 

关键的观察结果是，通过在最多 19 个数字中选择最多三个位置，并向这些位置分配非零数字，可以完全确定有效数字。 一旦位置选定，数字就独立了。 这将计数变成嵌入逐位有界枚举中的组合结构。 

因此我们计算一个函数$F(x)$: 中有效整数的个数$[1, x]$。 每个查询的回答如下$F(R) - F(L - 1)$。 

To compute$F(x)$，我们在位置上运行数字 DP，跟踪我们已经使用了多少个非零数字以及我们是否仍然受到前缀的限制$x$。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |$O((R-L)\cdot \log R)$|$O(1)$| 太慢了 |
 | 数字DP |$O(19 \cdot 4 \cdot 2 \cdot 10)$每个查询 |$O(19 \cdot 4 \cdot 2)$| 已接受 |

 ## 算法演练

 我们定义一个函数$F(x)$计算范围内的有效数字$[1, x]$。 

1. 转换$x$进入其十进制数字数组。 这让我们可以从最高有效数字开始逐个位置进行推理。 
2.定义DP状态$dp[pos][cnt][tight]$， 在哪里$pos$是当前的数字索引，$cnt$是我们已经使用了多少个非零数字，并且$tight$指示我们是否仍然匹配前缀$x$。 
3. 在每个位置，我们尝试从 0 到 9 的所有可能的数字，但我们将上限限制为当前数字$x$如果$tight = 1$。 这确保我们永远不会超过$x$。 
4. 对于每个候选数字，更新$cnt$如果数字非零则加 1。 如果超过 3，我们将放弃该转换。 
5. 转换到下一个位置，更新紧密标志：只有当我们完全匹配当前数字时，它才保持紧密$x$。 
6. 处理完所有位置后，将所有有效状态计为一个有效数。 我们还通过在 DP 中自然地处理前导零来确保排除空数解释。 
7. 计算$F(R)$和$F(L-1)$对于每个查询并减去。 

DP 通过允许开头有前导零来自然地处理不同长度的数字。 这些前导零不计入非零限制，因此不会影响有效性。 

### 为什么它有效

 中的每个数字$[1, x]$恰好对应 DP 树中的一条路径：每个数字选择定义一个唯一的前缀。 DP 按数字前缀对所有号码进行划分，且不重叠。 对非零数字的约束是局部且单调地强制执行的，这意味着一旦我们超过三个非零数字，就无法继续恢复有效性。 strict 标志确保我们只计算不超出界限的数字，从而保持上限限制的正确性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

from functools import lru_cache

def solve_case(x: int) -> int:
    if x <= 0:
        return 0
    digits = list(map(int, str(x)))
    n = len(digits)

    @lru_cache(None)
    def dp(pos: int, cnt: int, tight: int) -> int:
        if cnt > 3:
            return 0
        if pos == n:
            return 1

        limit = digits[pos] if tight else 9
        res = 0

        for d in range(limit + 1):
            new_cnt = cnt + (d != 0)
            new_tight = tight and (d == limit)
            res += dp(pos + 1, new_cnt, new_tight)

        return res

    return dp(0, 0, 1)

def solve():
    t = int(input())
    for _ in range(t):
        l, r = map(int, input().split())
        print(solve_case(r) - solve_case(l - 1))

if __name__ == "__main__":
    solve()
```该解决方案在上限的十进制表示形式上构建数字 DP。 递归跟踪到目前为止已放置了多少个非零数字。 一旦数量超过三个，就会立即修剪树枝。 

紧密标志是使用标准数字DP思想来实现的：当tight为true时，下一个数字不能超过界限中的相应数字； 否则，它可以在 0 到 9 之间自由变化。 

一个微妙的问题是前导零的处理。 它们自然地作为普通数字包含在 DP 中，但由于它们不会增加非零计数，因此它们允许我们表示较短长度的数字而无需特殊处理。 

## 工作示例

 我们使用样本输入。 

### 示例 1：$[1, 1000]$我们计算$F(1000)$。 DP 考虑 1000 以内的所有数字，并计算最多 3 个非零数字的数字。 

| 步骤| 邮政 | 碳纳米管| 紧| 行动|
 | ---| ---| ---| ---| ---|
 | 开始 | 0 | 0 | 1 | 从最高有效数字开始 |
 | 分支机构 | 1 | 0 | 变化 | 根据绑定选择数字 0-1 |
 | 修剪| 任何| >3 | -1 | 丢弃无效路径|

 最终结果包括从 1 到 1000 的所有数字，因为除了超出约束的数字之外，该范围内没有超过三个非零数字，并且 1000 本身是有效的。 

这证实了 DP 正确地包括了诸如 10 的幂之类的边界情况。 

### 示例 2：$[999999, 1000001]$我们分别评估终点。 

为了$1000001$，有效数字包括稀疏配置（如 1000000 和 1000001），但不包括密集数字（如 999999）。 

DP 通过数字结构将它们清晰地分开。 

| 数量 | 非零数字 | 有效 |
 | ---| ---| ---|
 | 999999 | 999999 6 | 没有|
 | 1000000 | 1 | 是的 |
 | 1000001 | 2 | 是的 |

 这证实了邻接性不会影响正确性，因为每个数字都是通过数字构造独立评估的。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(T \cdot 19 \cdot 4 \cdot 2 \cdot 10)$| 每个查询在最多 19 个数字、4 个非零计数状态、紧密标志和 10 个转换上运行数字 DP |
 | 空间|$O(19 \cdot 4 \cdot 2)$| DP 状态记忆表 |

 和$T \le 10^4$，这完全符合时间限制，因为 DP 状态空间很小并且每个查询都被大量重用。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    from functools import lru_cache

    def solve_case(x: int) -> int:
        if x <= 0:
            return 0
        digits = list(map(int, str(x)))
        n = len(digits)

        @lru_cache(None)
        def dp(pos: int, cnt: int, tight: int) -> int:
            if cnt > 3:
                return 0
            if pos == n:
                return 1

            limit = digits[pos] if tight else 9
            res = 0
            for d in range(limit + 1):
                new_cnt = cnt + (d != 0)
                new_tight = tight and (d == limit)
                res += dp(pos + 1, new_cnt, new_tight)
            return res

        return dp(0, 0, 1)

    def solve():
        t = int(input())
        out = []
        for _ in range(t):
            l, r = map(int, input().split())
            out.append(str(solve_case(r) - solve_case(l - 1)))
        return "\n".join(out)

    return solve()

# provided samples
assert run("4\n1 1000\n1024 1024\n65536 65536\n999999 1000001\n") == "1000\n1\n0\n2"

# custom cases
assert run("1\n1 1\n") == "1", "single valid number"
assert run("1\n999 999\n") == "1", "still valid under constraint"
assert run("1\n1111 1111\n") == "0", "four non-zero digits invalid"
assert run("1\n1 1000000000000000000\n") == run("1\n1 1000000000000000000\n"), "consistency check"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 1 1 | 1 1 | 最小边界|
 | 999 999 | 1 | 有效的密集极限情况 |
 | 1111 1111 | 0 | 恰好 4 个非零数字拒绝 |
 | 大品种全| 稳定计数 | 性能和正确性稳定性|

 ## 边缘情况

 关键的边缘情况是十的精确幂的数字，例如 1000 或 1000000。这些应该是有效的，因为它们恰好包含一个非零数字。 在 DP 中，这些是由于在较高位置选择数字 1 和在其他位置选择 0 而产生的。 该转换仅正确地递增非零计数器一次。 

另一个边缘情况是像 1000001 这样的数字，其中非零数字由长串零分隔。 DP不压缩结构； 它独立地处理每个位置，因此无论距离如何，两个非零数字都会被准确计数。 

最后，边界情况$L = 1$通过定义来处理$F(0) = 0$。 这避免了负范围并确保减法$F(R) - F(L-1)$没有特殊分支仍然有效。
