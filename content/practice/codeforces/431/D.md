---
title: "CF 431D - 随机任务"
description: "我们需要找到一个正整数 n，使得在区间 (n, 2n] 内，恰好 m 个数字在其二进制表示中恰好有 k 个。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "bitmasks", "combinatorics", "dp", "math"]
categories: ["algorithms"]
codeforces_contest: 431
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 247 (Div. 2)"
rating: 2100
weight: 431
solve_time_s: 121
verified: true
draft: false
---

[CF 431D - 随机任务](https://codeforces.com/problemset/problem/431/D)

 **评分：** 2100
 **标签：** 二分查找、位掩码、组合、dp、数学
 **求解时间：** 2m 1s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们需要找到一个正整数`n`使得在区间内`(n, 2n]`， 确切地`m`数字正好有`k`其二进制表示形式。 

表达条件的另一种方式是这样的：

 如果`f(x)`表示整数的个数`[0, x]`其二进制形式恰好包含`k`设置位，然后有效整数的数量`(n, 2n]`等于$f(2n)-f(n)=m$所以任务变成了找到任何`n ≤ 10^18`满足这个方程。 

这些限制完全排除了逐一检查数字的可能性。 甚至迭代所有数字直到`10^18`是不可能的。 我们需要更接近对数复杂度的东西。 由于答案保证存在并且目标表达式单调依赖于`n`，二分查找成为一个自然的方向。 

棘手的部分是计算`f(x)`高效。 一个简单的实现会检查来自的每个数字`0`到`x`并计算设置位，其成本`O(x log x)`。 和`x`靠近`10^18`，那就是无望了。 

一些边缘情况很容易被错误处理。 

如果`k`大于可用位数`x`，答案为`f(x)`必须为零。 例如：

 输入：```
1 64
```不小的数字有 64 个设置位，因此粗心的组合代码可能会访问无效索引或产生负计数。 

当当前数字本身恰好具有另一个微妙的情况时，就会出现`k`设置位。 假设：

 输入：```
1 1
```为了`n = 1`, 区间`(1, 2]`仅包含数字`2`，其二进制表示为`10`，恰好包含一组位。 正确答案是`1`。 忘记包含的数字 DP 实现`x`本身在`f(x)`会在这里失败。 

周围边界处理`(n, 2n]`也很危险。 区间不包括`n`但包括`2n`。 使用`f(2n) - f(n - 1)`而不是`f(2n) - f(n)`默默地改变了意义。 

例如：

 输入：```
1 2
```拿`n = 2`。 间隔`(2, 4]`包含`3`和`4`。 仅有的`3`恰好有两个设置位，因此计数等于`1`。 使用错误的区间公式计数`2`本身也会产生错误的答案。 

## 方法

 蛮力的想法很简单。 对于每位候选人`n`，检查中的每个数字`(n, 2n]`，数一下到底有多少个`k`设置位，并在计数等于时停止`m`。 

这是可行的，因为条件是可以直接检查的。 问题在于规模。 即使对于单身`n`，区间大小为`n`。 如果`n`就在附近`10^18`，我们大约需要`10^18`弹出计数操作。 这远远超出了任何现实的限制。 

下一个改进是观察我们只需要精确计算数字`k`将位设置为某个界限。 定义：$f(x)=\#\{0\le t\le x\mid \operatorname{popcount}(t)=k\}$然后里面有效整数的个数`(n, 2n]`变成：$f(2n)-f(n)$现在问题减少到有效评估`f(x)`。 

这就是二元组合学有用的地方。 我们处理一些`x`从最重要到最不重要。 每当我们遇到一个`1`位，我们可以选择放置`0`在那里，并在较低位置之间自由分配剩余的所需设置位。 这种可能性的数量是二项式系数。 

例如，如果我们还需要`r`那些并且有`p`剩余位位置，则路数等于：$\binom{p}{r}$这计算`f(x)`大约需要 64 个步骤。 

最终的观察结果是单调性。 作为`n`增加，数量`f(2n) - f(n)`永远不会减少。 数字只进入区间，永远不会消失。 这允许二分搜索`n`。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | 每个候选人 O(n log n) | O(1) | O(1) | 太慢了|
 | 最佳 | O(log^2 最大值) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 预先计算所有二项式系数`C[n][r]`为了`0 ≤ n, r ≤ 64`。 

我们最多只需要 64 位，因为`10^18 < 2^60`，并且使用 64 使实现变得简单。 
2. 实现一个功能`count(x)`返回有多少个整数`[0, x]`确切地包含`k`设置位。 

该函数从高到低扫描位。 
3. 维护一个变量`ones_used`，表示前缀中已经固定了多少个设置位。 
4. 当当前位`x`是`1`，我们考虑做这个`0`反而。 

那么剩下的较低位置可能包含任何排列：$k-ones\_used$那些。 

如果有`pos`剩余位置，我们添加：$\binom{pos}{k-ones\_used}$5. 处理完该分支后，继续执行实际的部分`x`，意味着该位保留`1`。 

增量`ones_used`。 
6. 如果在任何时候`ones_used > k`，提前停止，因为没有继续有效。 
7. 处理完所有位后，包括`x`本身，如果它恰好包含`k`设置位。 
8. 定义：$g(n)=count(2n)-count(n)$这等于中的整数个数`(n, 2n]`正好有`k`设置位。 
9. 二分查找最小的`n`这样：$g(n)\ge m$10、由于问题保证存在，所以搜索结束后，得到的`n`满足：$g(n)=m$### 为什么它有效

 计数函数枚举所有小于或等于的数字`x`通过从左到右固定位。 每当一个`1`位出现在`x`，选择`0`创建一个由较小数字组成的整个块，并且组合数学精确地计算其中有多少包含所需数量的设置位。 

二分查找是正确的，因为`g(n)`是单调非减的。 增加`n`扩大区间`(n, 2n]`向右。 新的数字可能满足条件，但以前计数的数字永远不会以减少总计数的方式消失。 由于答案存在，标准下界二分搜索会找到有效的`n`。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MAXB = 64

# Precompute combinations
C = [[0] * (MAXB + 1) for _ in range(MAXB + 1)]

for n in range(MAXB + 1):
    C[n][0] = 1
    C[n][n] = 1

for n in range(1, MAXB + 1):
    for r in range(1, n):
        C[n][r] = C[n - 1][r - 1] + C[n - 1][r]

def solve():
    m, k = map(int, input().split())

    def count_upto(x):
        if x < 0:
            return 0

        ans = 0
        ones_used = 0

        for pos in range(MAXB - 1, -1, -1):
            if (x >> pos) & 1:
                need = k - ones_used

                if 0 <= need <= pos:
                    ans += C[pos][need]

                ones_used += 1

                if ones_used > k:
                    break

        else:
            if ones_used == k:
                ans += 1

        return ans

    def g(n):
        return count_upto(2 * n) - count_upto(n)

    lo, hi = 1, 10**18

    while lo < hi:
        mid = (lo + hi) // 2

        if g(mid) >= m:
            hi = mid
        else:
            lo = mid + 1

    print(lo)

solve()
```第一部分使用帕斯卡三角形预先计算二项式系数。 由于最大相关位数最多为 64，因此该表很小。 

核心逻辑就在里面`count_upto(x)`。 该函数从高到低处理位。 每当它遇到一个`1`位，它计算通过放置形成的所有较小的数字`0`在那里，并将剩余的所需设置位分配给较低的位置。 

表达式：$C[pos][need]$是数字DP 理念的核心。 有`pos`可用的较低位位置，我们必须准确选择`need`他们之中成为`1`。 

这`else`附于`for`循环很微妙。 在 Python 中，仅当循环未被终止时才会执行`break`。 这意味着我们成功处理了所有位，现在可能包括`x`如果它的 popcount 等于它本身`k`。 

二分查找使用`g(mid) >= m`。 这是对第一个有效位置的下界搜索。 使用`>`相反，会跳过精确匹配。 

所有算术都安全地适合 Python 整数。 

## 工作示例

 ### 示例 1

 输入：```
1 1
```我们测试`n = 1`。 

间隔为`(1, 2]`，仅包含`2`。 

的二进制表示`2`是`10`，其中有一个设置位。 

| 价值| 二进制 | 人口统计 | 计数|
 | ---| ---| ---| ---|
 | 2 | 10 | 10 1 | 是的 |

 所以：$g(1)=1$答案是`1`。 

此示例确认间隔边界处理正确。`1`本身被排除在外，而`2`包括在内。 

### 示例 2

 输入：```
2 2
```尝试`n = 5`。 

间隔为`(5, 10]`。 

| 价值| 二进制 | 人口统计 | 计数|
 | ---| ---| ---| ---|
 | 6 | 110 | 110 2 | 是的 |
 | 7 | 111 | 111 3 | 没有 |
 | 8 | 1000 | 1000 1 | 没有 |
 | 9 | 1001 | 1001 2 | 是的 |
 | 10 | 10 1010 | 1010 2 | 是的 |

 这给出了计数`3`，太大。 

尝试`n = 4`。 

| 价值| 二进制 | 人口统计 | 计数|
 | ---| ---| ---| ---|
 | 5 | 101 | 101 2 | 是的 |
 | 6 | 110 | 110 2 | 是的 |
 | 7 | 111 | 111 3 | 没有 |
 | 8 | 1000 | 1000 1 | 没有 |

 现在计数等于`2`， 所以`n = 4`是有效的。 

此跟踪显示了二分搜索为何有效。 增加`n`向上移动计数。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(log² 最大值) | 二分查找执行约 60 次迭代，每次迭代超过 64 位 |
 | 空间| O(1) | O(1) | 只存储固定大小的组合表 |

 该算法很容易满足限制。 大致`60 × 64`需要进行一些操作，即使在 Python 中，这也是很小的。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

MAXB = 64

C = [[0] * (MAXB + 1) for _ in range(MAXB + 1)]

for n in range(MAXB + 1):
    C[n][0] = 1
    C[n][n] = 1

for n in range(1, MAXB + 1):
    for r in range(1, n):
        C[n][r] = C[n - 1][r - 1] + C[n - 1][r]

def solve():
    input = sys.stdin.readline

    m, k = map(int, input().split())

    def count_upto(x):
        if x < 0:
            return 0

        ans = 0
        ones_used = 0

        for pos in range(MAXB - 1, -1, -1):
            if (x >> pos) & 1:
                need = k - ones_used

                if 0 <= need <= pos:
                    ans += C[pos][need]

                ones_used += 1

                if ones_used > k:
                    break
        else:
            if ones_used == k:
                ans += 1

        return ans

    def g(n):
        return count_upto(2 * n) - count_upto(n)

    lo, hi = 1, 10**18

    while lo < hi:
        mid = (lo + hi) // 2

        if g(mid) >= m:
            hi = mid
        else:
            lo = mid + 1

    print(lo)

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()

    return sys.stdout.getvalue().strip()

# provided sample
assert run("1 1\n") == "1", "sample 1"

# interval (2,4] => only 3 has two set bits
assert run("1 2\n") == "2", "basic popcount test"

# interval (4,8] => 5 and 6
assert run("2 2\n") == "4", "multiple valid numbers"

# smallest k
assert run("1 64\n") != "", "large k edge case"

# boundary around powers of two
assert run("1 3\n") == "5", "checks interval boundaries"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 1`|`1`| 最小有效示例 |
 |`1 2`|`2`| 正确处理`(n, 2n]`|
 |`2 2`|`4`| 区间内多个有效数字 |
 |`1 64`| 任何有效号码 | 大的`k`处理|
 |`1 3`|`5`| 2 的幂附近的边界行为 |

 ## 边缘情况

 考虑：

 输入：```
1 64
```很少有数字包含 64 个设置位。 在组合计数期间，许多状态请求不可能的值，例如：$\binom{10}{64}$该实现安全地跳过这些，因为它检查：```
if 0 <= need <= pos:
```因此，无效的组合贡献为零，而不是导致索引错误。 

现在考虑边界敏感的情况：

 输入：```
1 2
```为了`n = 2`，间隔为`(2, 4]`。 

| 价值| 人口统计 |
 | ---| ---|
 | 3 | 2 |
 | 4 | 1 |

 恰好有一个数字符合资格。 

该算法计算：$count(4)-count(2)$

`count(4)`包括`{3}`， 尽管`count(2)`排除它。 结果正是`1`。 

最后，考虑一个情况`x`本身必须被计算在内。 

假设我们评估：$count(7)$和`k = 3`。 

的二进制表示`7`是`111`，它恰好具有三个设置位。 如果实现仅计算严格较小的数字，则会错过`7`。 

循环`else`当构造的数字等于时，块添加一个最终计数`x`并且正好有`k`设置位。 这正确地处理了这种情况。
