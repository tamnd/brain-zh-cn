---
title: "CF 145C - 幸运子序列"
description: "给定一个整数数组，我们必须计算有多少个长度恰好为 k 的子序列满足幸运数字的特殊限制。 如果每个十进制数字都是 4 或 7，则该数字是幸运的。例如 4、47 和 744。5、17 和 467 等数字则不幸运。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "combinatorics", "dp", "math"]
categories: ["algorithms"]
codeforces_contest: 145
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 104 (Div. 1)"
rating: 2100
weight: 145
solve_time_s: 125
verified: true
draft: false
---

[CF 145C - 幸运子序列](https://codeforces.com/problemset/problem/145/C)

 **评分：** 2100
 **标签：** 组合数学、dp、数学
 **求解时间：** 2m 5s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 给定一个整数数组，必须精确计算有多少个长度的子序列`k`满足幸运数字的特殊限制。 

如果每个小数位都是以下任一数字，则该数字是幸运的`4`或者`7`。 例子是`4`,`47`， 和`744`。 像这样的数字`5`,`17`， 和`467`并不幸运。 

通过从数组中选择索引来形成子序列。 如果两个子序列选择的索引集不同，即使值相同，它们也是不同的。 

这种限制很微妙。 幸运值在所选子序列中最多可能出现一次。 不幸的值可能会重复任意多次。 

假设数组是：```
[4, 4, 10]
```和`k = 2`。 

由索引组成的子序列`{1,2}`无效，因为它包含两个相同的幸运数字，都是`4`。 

子序列`{1,3}`和`{2,3}`是有效的。 

数组大小达到`10^5`，因此枚举所有子序列是不可能的。 有`2^n`总共子序列，甚至检查所有大小的子序列`k`大约需要`C(100000, 50000)`在最坏的情况下，操作量将是天文数字。 

这些限制强烈表明我们需要接近的东西`O(n log n)`或者`O(nk)`具有一个小的常数。 自从`k`还可以`10^5`， 甚至`O(nk)`除非有效状态空间远小于`n`。 

关键的结构观察是，直到`10^9`。 每个幸运数字仅由数字组成`4`和`7`，并且最多有 10 位数字。 总计数为：$\sum_{i=1}^{10} 2^i = 2046$所以虽然数组可能包含`100000`元素，不同幸运值的个数最多为`2046`。 

一些边缘情况可能会悄悄地破坏幼稚的实现。 

考虑：```
3 2
4 4 4
```正确答案是`0`。 

粗心的解决方案可能会说有`C(3,2)=3`子序列，但每对都包含重复的幸运值`4`，所以全部无效。 

现在考虑：```
4 2
10 10 10 10
```正确答案是：$\binom{4}{2}=6$不幸的值没有唯一性限制，因此完全允许重复。 

另一个棘手的情况是：```
5 3
4 4 7 10 10
```有效子序列最多只能包含一个`4`并且最多有一个`7`。 

有效的选择是：```
{4(first),7,10(first)}
{4(first),7,10(second)}
{4(second),7,10(first)}
{4(second),7,10(second)}
```答案是`4`。 

如果一个简单的实现只跟踪一个数字是否幸运，而不是单独跟踪不同的幸运值，那么就会出现错误计数。 

## 方法

 暴力解决方案在概念上很简单。 枚举每个大小的子序列`k`，检查其幸运元素，如果某个幸运值出现两次则拒绝。 

这是有效的，因为定义是本地的并且易于验证。 对于每个选定的索引子集，我们可以构建幸运数字的频率图并检查所有频率是否最多为 1。 

问题是子集的数量。 In the worst case we would examine:$\binom{100000}{50000}$这是完全不可行的。 

下一个自然尝试是对位置进行动态规划。 对于每个元素，我们要么接受它，要么跳过它。 但是，如果我们准确跟踪哪些幸运值已被使用，则状态空间的不同幸运值的数量将呈指数增长。 

突破来自于区分幸运和不幸的因素。 

不吉利的数字很容易出现。 他们完全没有任何限制。 如果有`u`不幸的因素，我们决定采取准确的`t`其中，方法的数量很简单：$\binom{u}{t}$幸运数字不同。 假设一个幸运值`x`出现`cnt[x]`次。 我们可以：

 1. 跳过值`x`完全地。 
2. 准确选择出现的一个`x`。 

如果我们选择的话，有`cnt[x]`不同的索引选择。 

这将问题转化为分组背包式DP。 

每个不同的幸运值的行为就像一个项目组，贡献：```
0 chosen elements, 1 way
1 chosen element, cnt[x] ways
```如果有`m`不同的幸运值，我们对这些组运行 DP：```
dp[j] = number of ways to choose j lucky elements
```计算出幸运贡献后，我们将其与不幸贡献结合起来。 

如果我们选择`j`幸运元素，我们还需要`k-j`不幸的元素。 总贡献变为：$dp[j] \cdot \binom{u}{k-j}$总结所有有效的`j`给出了答案。 

关键的减少是 DP 大小取决于不同幸运值的数量，最多`2046`，而不是`n`。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | 指数| 指数| 太慢了 |
 | 最佳 | O(n + m·k) | O(n + m·k) | O(k) | 已接受 |

 ## 算法演练

 1. 读取数组并将每个数字分类为幸运或不幸。 

如果每个小数位都是以下任一数字，则该数字是幸运的`4`或者`7`。 
2. 计算每个不同的幸运值出现的次数。 

我们将频率存储在哈希图中。 如果值`47`出现 5 次，我们记得我们可以选择这 5 个位置之一。 
3. 计算倒霉元素的总数。 

这些元素是不受限制的，所以后面我们只需要组合即可。 
4. 预计算阶乘和逆阶乘模`10^9+7`。 

这允许组合的恒定时间计算：$\binom{n}{r}=\frac{n!}{r!(n-r)!}$5. 初始化DP。 

让：```
dp[j] = number of ways to choose exactly j lucky elements
```最初：```
dp[0] = 1
```因为什么都不选择总是可能的。 
6. 独立处理每个不同的幸运值。 

假设当前频率为`c`。 

我们迭代`j`向后并更新：```
dp[j+1] += dp[j] * c
```乘以`c`出现是因为我们可以选择该幸运值的任何一次出现。 

向后迭代可以防止多次使用相同的幸运值。 
7. 结合幸运和不幸的选择。 

对于每一个可能的计数`j`精选幸运元素：```
need = k - j
```如果`0 <= need <= unlucky_count`， 添加：$dp[j] \cdot \binom{unlucky}{need}$8. 输出最终的和模数`10^9+7`。 

### 为什么它有效

 DP 不变量为：```
dp[j] = number of valid ways to choose exactly j elements
        from the processed lucky-value groups,
        using at most one occurrence from each group
```每个不同的幸运值都会被处理一次。 在其转换过程中，我们要么跳过该值，要么准确选择它的出现之一。 由于更新是向后进行的，因此相同的幸运值不能对单个状态贡献两次。 

处理完所有幸运组后，每个有效的幸运元素配置都会被计数一次。 

不幸元素与唯一性限制无关，因此一旦我们确定了使用多少幸运元素，剩余的位置就可以由任意不幸元素填充。 组合计数正确地计算了所有此类选择。 

因为每个有效子序列都有一个独特的分解为幸运和不幸的选择，所以最终的求和只对每个有效子序列计数一次。 

## Python 解决方案```python
import sys
from collections import Counter

input = sys.stdin.readline

MOD = 10**9 + 7

def is_lucky(x):
    while x > 0:
        d = x % 10
        if d != 4 and d != 7:
            return False
        x //= 10
    return True

def solve():
    n, k = map(int, input().split())
    arr = list(map(int, input().split()))

    lucky_freq = Counter()
    unlucky = 0

    for x in arr:
        if is_lucky(x):
            lucky_freq[x] += 1
        else:
            unlucky += 1

    fact = [1] * (n + 1)
    invfact = [1] * (n + 1)

    for i in range(1, n + 1):
        fact[i] = fact[i - 1] * i % MOD

    invfact[n] = pow(fact[n], MOD - 2, MOD)

    for i in range(n, 0, -1):
        invfact[i - 1] = invfact[i] * i % MOD

    def comb(a, b):
        if b < 0 or b > a:
            return 0
        return fact[a] * invfact[b] % MOD * invfact[a - b] % MOD

    dp = [0] * (k + 1)
    dp[0] = 1

    for cnt in lucky_freq.values():
        for j in range(k - 1, -1, -1):
            dp[j + 1] = (dp[j + 1] + dp[j] * cnt) % MOD

    ans = 0

    for lucky_taken in range(k + 1):
        need_unlucky = k - lucky_taken

        if need_unlucky <= unlucky:
            ways = dp[lucky_taken]
            ways = ways * comb(unlucky, need_unlucky) % MOD
            ans = (ans + ways) % MOD

    print(ans)

solve()
```第一部分区分幸运值和不幸值。 这`Counter`存储不同幸运数字的频率，因为相同幸运值的重复项不能同时出现在有效的子序列中。 

阶乘和逆阶乘数组支持快速组合查询。 如果执行多次，根据需要计算具有重复模逆的组合会太慢。 

DP 数组是一维的，因为每个幸运值只被处理一次。 向后迭代是必不可少的。 如果我们向前迭代，则在单个过渡阶段可以多次使用相同的幸运值。 

认为`cnt = 5`。 过渡：```
dp[j + 1] += dp[j] * 5
```意味着我们从 5 个相同的幸运数字中选择一个出现。 

最后的循环结合了幸运和不幸的选择。 我们必须检查一下`need_unlucky`在计算组合之前有效。 忘记这个边界检查是错误答案的常见来源。 

所有算术均以模进行`10^9+7`，因为中间值变得非常大。 

## 工作示例

 ### 示例 1

 输入：```
3 2
10 10 10
```没有幸运数字。 

| 步骤| 倒霉| 幸运频率 | DP |
 | ---| ---| ---| ---|
 | 初步解析 | 3 | {} | [1,0,0]|
 | 没有幸运处理| 3 | {} | [1,0,0]|
 | 组合 j=0 | 3 | {} | 答案 += C(3,2)=3 |

 最终答案：```
3
```这个例子表明，重复的不吉利数字是完全允许的。 唯一性限制仅适用于幸运值。 

### 示例 2

 输入：```
5 3
4 4 7 10 10
```| 步骤| 当前值| 频率| 步骤后 dp |
 | ---| ---| ---| ---|
 | 初始| - | - | [1,0,0,0]|
 | 流程 4 | 2 | [1,2,0,0]| |
 | 流程 7 | 1 | [1,3,2,0] | |

 有`2`不吉利的数字。 

现在结合：

 | 幸运的 需要_不幸 | 贡献 |
 | ---| ---| ---|
 | 0 | 3 | 0 |
 | 1 | 2 | 3 × C(2,2) = 3 |
 | 2 | 1 | 2 × C(2,1) = 4 |
 | 3 | 0 | 0 |

 最终答案：```
7
```该跟踪演示了如何将重复的幸运值压缩到单个 DP 组中。 价值`4`出现两次，但一次仅贡献一个选定的元素。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n + m·k) | O(n + m·k) | 数组扫描加上不同幸运值上的 DP |
 | 空间| O(k) | 一个大小为 DP 的数组`k+1`|

 这里`m`是不同幸运值的数量，边界为`2046`。 

即使在最坏的情况下，大约`2046 × 100000`DP 转换在 Python 中是可管理的，因为操作非常小并且对缓存友好。 相比之下，内存使用量很小`256 MB`限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io
from collections import Counter

MOD = 10**9 + 7

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline

    def is_lucky(x):
        while x > 0:
            d = x % 10
            if d != 4 and d != 7:
                return False
            x //= 10
        return True

    n, k = map(int, input().split())
    arr = list(map(int, input().split()))

    lucky_freq = Counter()
    unlucky = 0

    for x in arr:
        if is_lucky(x):
            lucky_freq[x] += 1
        else:
            unlucky += 1

    fact = [1] * (n + 1)
    invfact = [1] * (n + 1)

    for i in range(1, n + 1):
        fact[i] = fact[i - 1] * i % MOD

    invfact[n] = pow(fact[n], MOD - 2, MOD)

    for i in range(n, 0, -1):
        invfact[i - 1] = invfact[i] * i % MOD

    def comb(a, b):
        if b < 0 or b > a:
            return 0
        return fact[a] * invfact[b] % MOD * invfact[a - b] % MOD

    dp = [0] * (k + 1)
    dp[0] = 1

    for cnt in lucky_freq.values():
        for j in range(k - 1, -1, -1):
            dp[j + 1] = (dp[j + 1] + dp[j] * cnt) % MOD

    ans = 0

    for lucky_taken in range(k + 1):
        need_unlucky = k - lucky_taken

        if need_unlucky <= unlucky:
            ans = (
                ans
                + dp[lucky_taken] * comb(unlucky, need_unlucky)
            ) % MOD

    return str(ans) + "\n"

# provided sample
assert run("3 2\n10 10 10\n") == "3\n", "sample 1"

# minimum size
assert run("1 1\n4\n") == "1\n", "single lucky number"

# duplicate lucky values cannot both be used
assert run("3 2\n4 4 4\n") == "0\n", "duplicate lucky restriction"

# mix of lucky and unlucky
assert run("5 3\n4 4 7 10 10\n") == "7\n", "mixed case"

# all unlucky values
assert run("5 3\n1 2 3 5 6\n") == "10\n", "pure combinations"

# choose exactly one from repeated lucky group
assert run("4 2\n47 47 1 1\n") == "5\n", "group counting"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 1 / 4`|`1`| 最小输入尺寸|
 |`3 2 / 4 4 4`|`0`| 禁止重复幸运值 |
 |`5 3 / 4 4 7 10 10`|`7`| 幸运与不幸的混合处理|
 |`5 3 / 1 2 3 5 6`|`10`| 纯组合计数 |
 |`4 2 / 47 47 1 1`|`5`| 从幸运组中选择一个出现 |

 ## 边缘情况

 考虑：```
3 2
4 4 4
```该算法创建一个幸运组：```
freq[4] = 3
```DP 变为：

 | 步骤| DP |
 | ---| ---|
 | 初始| [1,0,0]|
 | 处理频率 3 | [1,3,0]|

 没有办法到达`dp[2]`，因为相同的幸运值不能被选中两次。 由于没有倒霉数字，所以最终答案是`0`。 

现在考虑：```
4 2
10 10 10 10
```根本没有幸运的群体。```
dp = [1,0,0]
unlucky = 4
```答案变成：$\binom{4}{2}=6$这证实了重复的不幸值是不受限制的。 

最后，考虑：```
5 2
4 7 47 74 10
```所有的幸运值都是不同的。 

DP 演变为：

 | 加工后| DP |
 | ---| ---|
 | 4 | [1,1,0]|
 | 7 | [1,2,1]|
 | 47 | 47 [1,3,3]|
 | 74 | 74 [1,4,6]|

 有一个不幸的值。 

最终的答案是：```
dp[2] * C(1,0) + dp[1] * C(1,1)
= 6 + 4
= 10
```每对不同的幸运值都是有效的，并且每个幸运值还可以与不幸的数字配对。
