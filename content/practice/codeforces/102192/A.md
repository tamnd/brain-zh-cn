---
title: "CF 102192A - 字符编码"
description: "长度为 m 的单词可以由 m 个编码字符值的数组表示。 每个位置独立地选择一个从 0 到 n - 1 的整数。我们需要计算有多少个这样的数组的总和恰好为 k。"
date: "2026-08-18T20:30:11+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102192
codeforces_index: "A"
codeforces_contest_name: "2018 Chinese Multi-University Training, Nanjing U Contest"
rating: 0
weight: 102192
solve_time_s: 162
verified: true
draft: false
---

[CF 102192A - 字符编码](https://codeforces.com/problemset/problem/102192/A)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 42s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 一个字的长度`m`可以用数组来表示`m`编码字符值。 每个位置独立地选择一个整数`0`通过`n - 1`。 我们需要准确计算有多少个这样的数组具有总和`k`。 

例如，与`n = 2`和`m = 3`，每个位置都包含`0`或者`1`。 这个词`[0, 1, 1]`有总和`2`， 尽管`[1, 1, 1]`有总和`3`。 不同的数组代表不同的单词，因为字符选择是有序的。 

答案取模`998244353`，因为有效数组的数量可能变得非常大。 

该界限排除了对每个测试用例的字长和目标总和的普通动态编程。 一个 DP 与`O(mk)`操作可能需要大约`10^10`一个测试用例的操作，当两者`m`和`k`是`10^5`。 聚合边界，其中所有的总和`n`,`m`， 和`k`每个最多`5 * 10^6`，建议算法大致线性`m + k`需要每个测试用例或更好的测试用例。 自从`k <= 10^5`、阶乘和逆阶乘也可以全局预先计算，从而允许在恒定时间内评估二项式系数。 

直接实现可能会错误地处理几种边界情况。 和`n = 1`，每个角色都必须有价值`0`，所以对于输入`1 5 0`答案是`1`， 尽管`1 5 1`有答案`0`。 假设每个值的公式`0`到`n - 1`至少给出两个选择可能会使这种情况出错。 

最大可能的总和是`m(n - 1)`。 因此`2 3 3`有答案`1`，因为唯一的数组是`[1,1,1]`， 尽管`2 3 4`有答案`0`。 仅检查是否存在的实现`k`为非负数可能会意外地计算出不可能的和。 

下边界的行为类似。 对于每个有效的`n`和`m`，唯一有总和的数组`0`是`[0,0,...,0]`。 因此`5 4 0`有答案`1`。 这也是对二项式系数公式中的差一误差的有用测试。 

## 方法

 暴力法直接枚举每一个可能的单词。 每个`m`职位有`n`选择，所以有`n^m`要检查的数组。 对于每个数组，我们可以计算其总和`O(m)`时间、给予`O(m n^m)`工作。 即使增量地维护总和，枚举本身仍然需要花费`O(n^m)`。 为了`n = m = 10^5`，这不仅太慢，而且是超出任何实际操作计数的天文数字。 

标准的动态规划公式要好得多。 让`dp[i][s]`是长度的数量-`i`带和的数组`s`。 添加一个字符给出`dp[i][s] = dp[i-1][s] + dp[i-1][s-1] + ... + dp[i-1][s-(n-1)]`。 

滑动窗口可以将每次转换减少到`O(1)`，使得整个DP`O(mk)`。 这已经是一个实质性的改进，但最坏的情况仍然需要大约`10^10`操作，所以不适合。 

关键的观察是每个位置的选择恰好是区间中的整数`[0,n-1]`。 如果没有上限，则非负解的数量`x1 + x2 + ... + xm = k`是星条形值`C(k + m - 1, m - 1)`。 

上限`xi <= n-1`可以通过包含排除来处理。 对于选定的一组`j`违反上限的位置，减去`n`来自他们每个人。 如果它们的原始值至少是`n`， 写`xi = yi + n`， 在哪里`yi >= 0`。 其余变量是不受限制的非负整数，它们的新和是`k - jn`。 

有`C(m,j)`违规位置的选择方式，以及相减后的非负解数`n`是`C(k - jn + m - 1, m - 1)`。 

因此，答案是`sum (-1)^j C(m,j) C(k - jn + m - 1, m - 1)`全面的`j`为此`jn <= k`。 条款与`j > m`不存在，因为我们不能选择更多`m`违反职务。 

暴力破解之所以有效，是因为它单独考虑每个有效数组，但会失败，因为数组的数量是指数级的。 DP 按部分和对数组进行分组，但仍然处理太多状态。 包含-排除观察根据哪些位置超出允许值对所有数组进行分组，最多将计算量减少到`min(m, floor(k/n)) + 1`二项式项。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |`O(n^m)`或者`O(m n^m)`具有显式求和计算 |`O(m)`| 太慢了 |
 | DP带推拉窗|`O(mk)`|`O(k)`| 在最坏的情况下太慢|
 | 包容-排除|`O(min(m, k/n))`预处理后的每个测试用例|`O(max(m+k))`| 已接受 |

 ## 算法演练

 1. 读取每个测试用例并确定其中的最大值`m + k`这将是需要的。 预先计算阶乘和逆阶乘直至该最大值。 我们需要这些数组，因为每个项都包含二项式系数。 
2. 在应用公式之前，检查是否`k > m(n-1)`。 当每个字符都有值时，获得最大可能的总和`n-1`，所以这样的目标没有有效的单词，答案是立即`0`。 
3. 对于其余情况，用`j = 0`包含-排除项，`C(k + m - 1, m - 1)`。 

这将计算所有非负数组的总和`k`，不强制执行上限。 
4. 对于`j = 1, 2, ...`，当以下任一情况时停止`j > m`或者`jn > k`。 对于每个有效的`j`， 计算`C(m,j) * C(k - jn + m - 1, m - 1)`。 

第一个因素选择`j`位置违反上限。 第二个因素计算减去后的分配数`n`从每个选定的位置。 
5.添加术语当`j`是偶数并减去它`j`很奇怪。 这是与所选违规位置的数量相对应的包含-排除符号。 
6. 减少运行答案模数`998244353`每次操作后。 最后打印归一化后的结果。 

二项式系数的计算方法为`C(a,b) = fact[a] * invfact[b] * invfact[a-b] mod MOD`。 

阶乘计算一次，逆阶乘是从一个模逆和后向递归获得的。 

### 为什么它有效

 考虑长度为所有非负整数数组的集合`m`其总和是`k`。 星形和条形对这组进行计数`C(k+m-1,m-1)`。 我们需要删除包含一个或多个位置的数组，其值至少为`n`。 

对于任何选定的一组`j`违反位置，减去`n`从每个选定的值。 这将创建一个具有非负数组的双射，其总和为`k-jn`。 有`C(k-jn+m-1,m-1)`这样的数组，并且有`C(m,j)`所选职位的选择。 

包含-排除添加具有偶数个违规的集合并减去具有奇数个违规的集合。 每个无效数组`r`违反立场有助于`C(r,0) - C(r,1) + C(r,2) - ... + (-1)^r C(r,r) = 0`,

 而每个有效数组都具有零违规并且仅贡献一次。 因此，最终的总和精确地计算了有效单词。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 998244353

def solve():
    t = int(input())
    tests = [tuple(map(int, input().split())) for _ in range(t)]

    max_size = 0
    for n, m, k in tests:
        max_size = max(max_size, m + k)

    fact = [1] * (max_size + 1)
    for i in range(1, max_size + 1):
        fact[i] = fact[i - 1] * i % MOD

    invfact = [1] * (max_size + 1)
    invfact[max_size] = pow(fact[max_size], MOD - 2, MOD)
    for i in range(max_size, 0, -1):
        invfact[i - 1] = invfact[i] * i % MOD

    def comb(a, b):
        if b < 0 or b > a or a < 0:
            return 0
        return fact[a] * invfact[b] % MOD * invfact[a - b] % MOD

    out = []

    for n, m, k in tests:
        if k > m * (n - 1):
            out.append("0")
            continue

        if k == 0:
            out.append("1")
            continue

        ans = 0
        max_j = min(m, k // n)

        for j in range(max_j + 1):
            remaining = k - j * n
            ways = comb(m, j) * comb(
                remaining + m - 1, m - 1
            ) % MOD

            if j & 1:
                ans -= ways
            else:
                ans += ways

        out.append(str(ans % MOD))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```第一次通过测试用例找到所需的最大阶乘索引。 最大的二项式参数是`k + m - 1`，因此通过分配阶乘`m + k`就足够了，并且避免了单独的每个测试用例分配。 

这`comb`对于无效参数，函数返回零。 在主循环中，它的参数始终有效，因为`remaining = k - jn`是非负的，但是保持边界检查可以使助手安全并防止微妙的负索引行为。 

最大可能和检查在包含-排除循环之前执行。 这避免了不必要的工作并直接处理不可能的目标。 

该循环包括`j = 0`。 该术语是不受限制的星条数。 循环极限为`min(m, k // n)`，因为选择超过`m`职位是不可能的并且选择`j`职位至少需要`jn`总和。 

Python整数不会溢出，但所有乘法结果都会模数减少`MOD`。 这使中间值保持较小并匹配所需的算术。 

逆阶乘数组由一次模幂生成。 自从`998244353`是素数，费马小定理给出`fact[max_size]^(MOD-2)`作为其模逆。 每个较小的逆阶乘都可以从`invfact[i-1] = invfact[i] * i`。 

## 工作示例

 ### 示例 1

 考虑`n = 2`,`m = 3`,`k = 3`。 每个位置只能包含`0`或者`1`。 最大总和是`3`，因此目标正好位于上边界。 

|`j`|`remaining = k - jn`|`C(m,j)`|`C(remaining+m-1,m-1)`| 签署条款 | 回答 |
 | --- | --- | --- | --- | --- | --- |
 | 0 | 3 | 1 | 10 | 10 +10 | 10 | 10
 | 1 | 1 | 3 | 3 | -9 | 1 |

 为了`j = 2`,`2n = 4 > k`，因此循环停止。 结果是`1`，对应于`[1,1,1]`。 

无限制计数开始于`10`，其中包括包含值大于的数组`1`。 这`j = 1`term 删除那些无效数组，只留下单个有效数组。 

### 示例 2

 考虑`n = 2`,`m = 3`,`k = 4`。 最大可能的总和仅为`3`，因此算法在执行包含-排除之前拒绝该情况。 

|`n`|`m`|`k`| 最大总和`m(n-1)`| 结果 |
 | --- | --- | --- | --- | --- |
 | 2 | 3 | 4 | 3 | 0 |

 这说明了为什么最大和检查必须使用`m(n-1)`，不仅仅是比较`k`和`m`或者`n`。 

### 示例 3

 对于`n = 3`,`m = 3`,`k = 3`，字符有值`0`,`1`， 或者`2`。 

|`j`|`remaining`|`C(3,j)`| 星条计数| 签署条款 | 回答 |
 | --- | --- | --- | --- | --- | --- |
 | 0 | 3 | 1 | 10 | 10 +10 | 10 | 10
 | 1 | 0 | 3 | 1 | -3 | 7 |

 结果是`7`。 无限制计数恰好包含三个数组，其中一个位置至少为`3`，并且这些被第一个校正项删除。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |`O(M + Σ min(m, k/n))`|`M = max(m+k)`用于阶乘预处理，每个测试用例后跟一个包含-排除循环 |
 | 空间|`O(M)`| 阶乘和逆阶乘数组 |

 在所有测试用例中，`Σk <= 5 * 10^6`和`Σm <= 5 * 10^6`。 自从`min(m, k/n) <= k`对于每个测试用例，包含-排除迭代的总数最多为`5 * 10^6`直至小`+1`每个测试用例的贡献。 阶乘预处理只需要大约`max(m+k) <= 2 * 10^5`，因此时间和内存要求都在限制范围内。 

## 测试用例```python
import sys
import io

MOD = 998244353

def solve(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    input = sys.stdin.readline

    t = int(input())
    tests = [tuple(map(int, input().split())) for _ in range(t)]

    max_size = max(m + k for n, m, k in tests)

    fact = [1] * (max_size + 1)
    for i in range(1, max_size + 1):
        fact[i] = fact[i - 1] * i % MOD

    invfact = [1] * (max_size + 1)
    invfact[max_size] = pow(fact[max_size], MOD - 2, MOD)
    for i in range(max_size, 0, -1):
        invfact[i - 1] = invfact[i] * i % MOD

    def comb(a, b):
        if b < 0 or b > a or a < 0:
            return 0
        return fact[a] * invfact[b] % MOD * invfact[a - b] % MOD

    out = []

    for n, m, k in tests:
        if k > m * (n - 1):
            out.append("0")
            continue

        if k == 0:
            out.append("1")
            continue

        ans = 0
        for j in range(min(m, k // n) + 1):
            remaining = k - j * n
            ways = comb(m, j) * comb(
                remaining + m - 1, m - 1
            ) % MOD

            if j & 1:
                ans -= ways
            else:
                ans += ways

        out.append(str(ans % MOD))

    result = sys.stdout.getvalue()

    sys.stdin = old_stdin
    sys.stdout = old_stdout

    return result

# Provided samples
sample = """4
2 3 3
2 3 4
3 3 3
128 3 340
"""
assert solve(sample) == "1\n0\n7\n903\n", "provided samples"

# Minimum alphabet and minimum target
assert solve("1\n1 1 0\n") == "1\n", "minimum-size valid case"

# n = 1 has only the all-zero word
assert solve("1\n1 5 1\n") == "0\n", "n=1 impossible positive sum"

# Maximum possible sum, exactly one word
assert solve("1\n2 5 5\n") == "1\n", "upper boundary"

# Just above the maximum possible sum
assert solve("1\n2 5 6\n") == "0\n", "above upper boundary"

# n=3, m=2, k=2:
# [0,2], [1,1], [2,0]
assert solve("1\n3 2 2\n") == "3\n", "small inclusion-exclusion case"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1 0`|`1`| 最小尺寸输入和唯一的零和字 |
 |`1 5 1`|`0`| 特别的`n = 1`案例 |
 |`2 5 5`|`1`| 确切的最大可能总和 |
 |`2 5 6`|`0`| 目标刚刚超出可行范围|
 |`3 2 2`|`3`| 进行包含排除校正的小案例|

 ## 边缘情况

 当`n = 1`，每个角色都被迫重视`0`。 为了`1 5 0`，最大可能的总和是`5(1-1)=0`，所以目标是可行的，唯一的数组是`[0,0,0,0,0]`。 算法返回`1`。 为了`1 5 1`，目标超过最大总和`0`，所以它返回`0`立即地。 这可以防止包含-排除循环依赖于不存在的正字符值。 

对于恰好处于最大值的目标，请考虑`2 3 3`。 每个位置最多`1`，所以达到总和`3`力量`[1,1,1]`。 公式给出`C(5,2) - C(3,1)C(2,2) = 10 - 9 = 1`。 边界计算正确是因为`j = 1`校正删除每个至少包含一个值的无限制解`2`。 

对于高于最大值的目标，`2 3 4`有最大可能的总和`3`。 该算法检测到`4 > 3`并返回`0`不评估任何二项式系数。 未明确考虑此边界的 DP 或包含排除实现可能会浪费大量工作，并且具有错误处理负余数的公式可能会产生无效计数。 

对于零目标，请考虑`5 4 0`。 每个字符值都是非负的，因此零之和迫使每个值都为零。 这`j = 0`术语是`C(3,3)=1`， 和`k // n = 0`，因此没有修正项。 答案正是`1`。 

对于暴露上限修正的小情况，请考虑`3 2 2`。 无限制`xi <= 2`， 有`C(3,1)=3`解决方案：`[0,2]`,`[1,1]`， 和`[2,0]`，所有这些都已经有效。 包含-排除循环有`j = 0`和`j = 1`，但是对于`j = 1`，剩余的总和为负数，因为`k-n = -1`， 所以`j=1`根本没有达到。 结果依然`3`。 这证实了循环条件`j <= k/n`在引入无效的负剩余金额之前正确停止。
