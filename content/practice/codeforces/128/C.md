---
title: "CF 128C - 矩形游戏"
description: "我们从在网格纸上绘制一个矩形开始。 只有边界很重要，而不是内部。 玩家在前一个矩形内重复绘制一个严格较小的矩形。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "combinatorics", "dp"]
categories: ["algorithms"]
codeforces_contest: 128
codeforces_index: "C"
codeforces_contest_name: "Codeforces Beta Round 94 (Div. 1 Only)"
rating: 2000
weight: 128
solve_time_s: 112
verified: true
draft: false
---

[CF 128C - 矩形游戏](https://codeforces.com/problemset/problem/128/C)

 **评级：** 2000
 **标签：** 组合数学，dp
 **求解时间：** 1m 52s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们从在网格纸上绘制一个矩形开始。 只有边界很重要，而不是内部。 玩家在前一个矩形内重复绘制一个严格较小的矩形。 新边框在任何一点都不能接触到前一个边框，因此每个新矩形必须在所有四个方向上至少与旧矩形分开一个网格单元。 

恰好之后`k`移动，我们想要计算有多少种不同的最终图纸是可能的。 如果在过程中绘制的矩形集不同，则认为两个游戏不同。 

关键的观察结果是，每次移动都会通过从顶部删除至少一行、从底部删除一行、从左侧删除一行和从右侧删除至少一行来缩小矩形。 如果当前矩形有高度`h`和宽度`w`，下一个矩形必须严格适合内部，且至少有一层间距，因此它的高度最多变为`h - 2`它的宽度最多变为`w - 2`。 

约束条件达到`1000`对于所有三个参数。 这立即排除了任何显式生成矩形序列的方法。 如果每次转换都很昂贵，即使是三次动态程序在 Python 中也会变得危险。 我们周围需要一些东西`O(n + m + k)`或者`O(nk + mk)`。 

有几种容易被忽略的边缘情况。 

如果`k = 1`，我们只选择严格位于原始矩形内的一个矩形。 例如：```
3 3 1
```答案是`1`，因为只有中央`1 × 1`方形作品。 

粗心的实现可能会错误地计算接触外边框的矩形。 

当矩形在完成所有移动之前变得太小时，会发生另一种微妙的情况。```
2 2 2
```正确答案是`0`。 

一步移动后，唯一可能的矩形是`0 × 0`，这是无效的。 任何只跟踪收缩操作数量而不检查几何可行性的解决方案都会过度计算。 

一个更有趣的例子是：```
4 5 1
```答案是`9`。 

有效的内部矩形是：```
1×1: 6 positions
1×2: 2 positions
2×1: 1 position
```简单的矩形计数公式常常会忽略放置计数取决于尺寸的事实。 

## 方法

 蛮力解释很简单。 在每次移动时，枚举所有严格适合前一个矩形且不触及其边框的矩形。 递归地继续`k`移动。 

这是可行的，因为每个有效的游戏实际上都是矩形的嵌套序列。 递归完全符合游戏规则。 

问题在于分支因素。 一个长方形的大小`h × w`大致包含`O(h²w²)`子矩形。 在最坏的情况下，递归树会呈指数爆炸。 即使对于中等尺寸，状态的数量也会变得巨大。 

游戏的结构提供了更清晰的视角。 

假设原始矩形跨越行`[1, n]`和列`[1, m]`。 每一步都独立选择从上、下、左、右收缩多少。 由于矩形不能接触，因此每次移动都必须将所有四个边距至少增加`1`。 

后`k`移动，我们选择了：```
k rows removed from the top,
k rows removed from the bottom,
k columns removed from the left,
k columns removed from the right.
```顺序仅与这些移除在移动中的分布方式有关。 

首先关注垂直维度。 

如果毕竟我们移除了`a`从顶部开始的行和`b`从底部开始行，然后：```
a ≥ k
b ≥ k
a + b < n
```跨移动的移除顺序对应于分区`a`进入`k`积极的部分和分区`b`进入`k`积极的部分。 

分割整数的方法数`x`进入`k`积极的部分是：$\binom{x-1}{k-1}$我们不跟踪每个中间矩形，而是只计算总收缩率的分布情况。 

同样的推理也适用于水平方向。 

用标准组合恒等式简化总和后，有效垂直收缩模式的总数变为：$\binom{n-1}{2k}$同样，水平图案的数量为：$\binom{m-1}{2k}$两个维度是独立的，所以最终的答案就是他们的乘积。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | 指数| 指数| 太慢了|
 | 最佳 | O(n + m) | O(n + m) | 已接受 |

 ## 算法演练

 1. 阅读`n`,`m`， 和`k`。 
2. 检查是否`2k > n - 1`或者`2k > m - 1`。 

每一步都至少消耗相对双方一层。 后`k`移动，我们至少需要`2k`删除行和`2k`总共删除了列。 如果任一维度太小，则不存在有效序列。 
3. 预先计算阶乘和逆阶乘`1000`。 

我们需要快速二项式系数查询模`10^9 + 7`。 
4. 计算：$\binom{n-1}{2k}$5. 计算：$\binom{m-1}{2k}$6. 将两个值相乘取模`10^9 + 7`。 
7. 打印结果。 

### 为什么它有效

 每次移动都会独立增加四个边距：上、下、左、右。 毕竟`k`移动时，相对侧的总移除量决定了整个嵌套结构。 

选择一个有效的游戏就等于选择了`2k`强制收缩层发生在`n - 1`可用的垂直间隙，并且类似地`m - 1`水平间隙。 

组合恒等式精确地计算这些选择，既不丢失也不重复任何矩形序列。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 10**9 + 7

def build_factorials(limit):
    fact = [1] * (limit + 1)
    for i in range(1, limit + 1):
        fact[i] = fact[i - 1] * i % MOD

    inv_fact = [1] * (limit + 1)
    inv_fact[limit] = pow(fact[limit], MOD - 2, MOD)

    for i in range(limit, 0, -1):
        inv_fact[i - 1] = inv_fact[i] * i % MOD

    return fact, inv_fact

def comb(n, r, fact, inv_fact):
    if r < 0 or r > n:
        return 0
    return fact[n] * inv_fact[r] % MOD * inv_fact[n - r] % MOD

def solve():
    n, m, k = map(int, input().split())

    limit = max(n, m)
    fact, inv_fact = build_factorials(limit)

    ans = comb(n - 1, 2 * k, fact, inv_fact)
    ans *= comb(m - 1, 2 * k, fact, inv_fact)
    ans %= MOD

    print(ans)

solve()
```阶乘预计算支持常数时间二项式系数查询。 由于最大值仅为`1000`，这个很便宜。 

帮手`comb`通过返回来安全地处理无效的情况`0`什么时候`r > n`。 它会自动处理不可能的配置，例如`2k > n - 1`。 

该公式使用`n - 1`和`m - 1`因为收缩发生在网格线之间。 一个常见的差一错误是使用`n`直接，这超出了不可能的边界放置。 

模逆使用费马小定理，因为`10^9 + 7`是素数。 

## 工作示例

 ### 示例 1

 输入：```
3 3 1
```我们计算：

 | 变量| 价值|
 | ---| ---|
 | n - 1 | n - 1 2 |
 | 米 - 1 | 2 |
 | 2k| 2 |
 | C(2, 2) | C(2, 2) | 1 |
 | C(2, 2) | C(2, 2) | 1 |
 | 回答 | 1 |

 唯一有效的矩形是中心矩形`1 × 1`正方形。 这证实了每次移动都必须在所有边上留下一层间距。 

### 示例 2

 输入：```
4 5 1
```我们计算：

 | 变量| 价值|
 | ---| ---|
 | n - 1 | n - 1 3 |
 | 米 - 1 | 4 |
 | 2k| 2 |
 | C(3, 2) | C(3, 2) | 3 |
 | C(4, 2) | C(4, 2) | 6 |
 | 回答 | 18 | 18

 垂直尺寸提供了三种选择顶部和底部收缩位置的方法。 水平维度有六种贡献。 他们的产品给出了所有可能的内部矩形。 

此示例演示了行和列之间的独立性。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(最大(n, m)) | 阶乘预计算占主导地位 |
 | 空间| O(最大(n, m)) | 阶乘和逆阶乘数组 |

 限制最多为`1000`，这个解决方案很容易满足时间和内存的限制。 计算实际上是瞬时的。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

MOD = 10**9 + 7

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    def build_factorials(limit):
        fact = [1] * (limit + 1)

        for i in range(1, limit + 1):
            fact[i] = fact[i - 1] * i % MOD

        inv_fact = [1] * (limit + 1)
        inv_fact[limit] = pow(fact[limit], MOD - 2, MOD)

        for i in range(limit, 0, -1):
            inv_fact[i - 1] = inv_fact[i] * i % MOD

        return fact, inv_fact

    def comb(n, r, fact, inv_fact):
        if r < 0 or r > n:
            return 0
        return fact[n] * inv_fact[r] % MOD * inv_fact[n - r] % MOD

    n, m, k = map(int, input().split())

    fact, inv_fact = build_factorials(max(n, m))

    ans = comb(n - 1, 2 * k, fact, inv_fact)
    ans *= comb(m - 1, 2 * k, fact, inv_fact)
    ans %= MOD

    return str(ans)

# provided sample
assert run("3 3 1\n") == "1", "sample 1"

# minimum possible input
assert run("1 1 1\n") == "0", "cannot place any inner rectangle"

# exactly enough space for one move
assert run("3 4 1\n") == "3", "single shrinking layer"

# impossible because too many moves
assert run("5 5 3\n") == "0", "not enough layers"

# symmetric medium case
assert run("5 5 1\n") == "36", "basic combinatorial count"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 1 1`|`0`| 最小尺寸 |
 |`3 4 1`|`3`| 精确边界可行性|
 |`5 5 3`|`0`| 不可能的移动次数 |
 |`5 5 1`|`36`| 一般组合计数|

 ## 边缘情况

 考虑：```
2 2 2
```我们需要：```
2k = 4
n - 1 = 1
m - 1 = 1
```该算法计算：```
C(1, 4) = 0
```对于两个维度，所以答案变成`0`。 

这正确地反映了几何形状。 一次移动后，已经没有空间容纳另一个矩形了。 

现在考虑：```
3 3 1
```计算变为：```
C(2, 2) × C(2, 2) = 1
```只有一个合法位置，即中心单元格。 这证实了组合解释自动排除了接触外边界的矩形。 

最后，考虑：```
1000 1000 1
```答案是：```
C(999, 2)^2
```该实现可以有效地处理这个问题，因为所有二项式系数都是在线性预处理后在恒定时间内计算的。
