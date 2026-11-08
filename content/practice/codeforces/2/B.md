---
title: "CF 2B - 最少圆路"
description: "我们有一个 n × n 的非负整数网格。 从左上角开始，我们只能向右或向下移动，直到到达右下角。 沿着选定的路径，我们将每个访问过的值相乘。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "dp", "math"]
categories: ["algorithms"]
codeforces_contest: 2
codeforces_index: "B"
codeforces_contest_name: "Codeforces Beta Round 2"
rating: 2000
weight: 2
solve_time_s: 187
verified: false
draft: false
---
## 问题理解

 我们有一个`n × n`非负整数网格。 从左上角开始，我们只能向右或向下移动，直到到达右下角。 沿着选定的路径，我们将每个访问过的值相乘。 目标是使生成的结果以尽可能少的尾随零结尾。 

只要产品包含因子，就会出现尾随零`10`，以及每一个`10`由一个因素组成`2`与一个因素配对`5`。 这意味着尾随零的数量等于：$\min(\text{count of factor }2,\ \text{count of factor }5)$因此网格中的实际值本身并不重要。 重要的是每个数字贡献因子的次数`2`和`5`。 

网格尺寸可达`1000 × 1000`，这意味着有 100 万个细胞。 任何显式探索路径的算法都是没有希望的，因为有效路径的数量是巨大的。 一条路径从`(0,0)`到`(n-1,n-1)`恰好包含`2n-2`移动，然后我们选择哪个`n-1`其中一些是向下的。 路径总数为：$\binom{2n-2}{n-1}$为了`n = 1000`，这个数字是一个天文数字。 我们需要一个多项式时间的解决方案，最好是`O(n²)`。 

最微妙的边缘情况涉及网格内的零。 经过零的路径产生总乘积`0`， 和`0`通常被认为至少有一个尾随零。 这会产生一种不寻常的情况，其中包含零的路径实际上可能比所有非零路径更好。 

考虑：```
2
1 10
1 0
```任何避免零的路径都会给出乘积`10`，其中有一个尾随零。 通过零的路径给出乘积`0`，也被视为有一个尾随零。 答案应该还是`1`。 

现在考虑：```
2
10 10
10 0
```每个非零路径都会产生`100`，它有两个尾随零。 遍历零只会给出一个尾随零，因此最佳答案变为`1`。 

粗心的实施常常将零视为贡献无限的因素`2`和`5`，这会错误地禁止经过零的路径。 正确的处理是记住零是否存在，并可能通过它构造一条特殊路径。 

另一个容易犯的错误是，当两个方向给出相同的 DP 值时，会错误地重建路径。 如果没有仔细存储父转换，则打印的路线可能与计算出的最佳路线不对应。 

## 方法

 蛮力的想法很简单。 枚举从左上角到右下角的每条有效路径，计算沿该路径的乘积，计算其尾随零，并保留最佳答案。 

这是有效的，因为问题的定义直接与路径相关。 每条有效路线都可以独立检查。 问题在于路径的数量。 路径由以下部分组成`n-1`向下移动和`n-1`按某种顺序向右移动，给出：$\binom{2n-2}{n-1}$为了`n = 20`，这已经超过三百亿条路径了。 暴力方法在实际限制之前很久就变得不可用。 

关键的观察是尾随零仅取决于质因数的计数`2`和`5`。 对于每个单元格，我们可以预先计算：```
twos[i][j]  = exponent of 2 in grid[i][j]
fives[i][j] = exponent of 5 in grid[i][j]
```如果一条路径累积`a`的因素`2`和`b`的因素`5`，那么尾随零的数量等于`min(a, b)`。 

这彻底改变了问题。 我们不需要乘以巨大的数字，而只需要沿路径增加成本。 动态规划变得自然，因为每一步仅取决于顶部或左侧的邻居。 

仍然存在一个微妙之处。 最小化`min(a, b)`直接比较尴尬，因为最小值同时取决于两个量。 诀窍是解决两个独立的 DP 问题：```
minimum total factors of 2
minimum total factors of 5
```任何具有最少尾随零的路径都必须优化这些计数之一。 如果最优路径有`k`尾随零，则其计数`2`s 等于`k`或其计数`5`s 等于`k`。 

所以我们运行两次DP并得到更好的结果。 

零号病例需要特殊处理。 如果每条普通路径的答案都大于 1，则零单元格可以恰好提供一个尾随零。 在这种情况下，我们故意构建一条穿过零的路径。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 指数| 指数递归栈| 太慢了 |
 | 最佳 | O(n²) | O(n²) | 已接受 |

 ## 算法演练

 1. 对于每个单元格，计算其值可以被整除多少次`2`并由`5`。 

例如，`40 = 2³ × 5¹`，所以它贡献了三个因素`2`和一个因素`5`。 
2. 如果一个单元格包含`0`，分别记住它的坐标。 

我们暂时将零视为在两个 DP 表中贡献了非常大的成本，因此普通的 DP 路径会避免它，除非稍后明确需要。 
3. 为以下因素建立 DP 表`2`。 

让`dp2[i][j]`是因子总数的最小数`2`需要到达细胞`(i,j)`。 

过渡：```
dp2[i][j] = twos[i][j] + min(top, left)
```4. 存储到达每个单元格的方向。 

这允许在 DP 完成后重建实际路径。 
5. 对因子重复相同的过程`5`。 

这给出了另一个 DP 表`dp5`。 
6.设：```
best2 = dp2[n-1][n-1]
best5 = dp5[n-1][n-1]
```最好的普通路径有答案：```
min(best2, best5)
```7. 检查是否存在零格。 

如果普通答案已经是`0`，使用零无法改善它。 

如果普通答案大于`1`，然后通过零进行路由即可准确给出答案`1`，哪个更好。 
8. 如果使用零更好，请手动构建路径。 

向下移动直至到达零行，向右移动直至到达零列，然后向右下角结束。 
9. 否则，使用存储的父方向重建更好的 DP 路径。 

### 为什么它有效

 对于任何整数乘积，尾随零等于完整的数`(2,5)`其质因数分解中的对。 由于每条路径都独立地跨细胞累积因子，因此`2`沙`5`s 成为加法。 动态规划正确地计算了可达到的最小总和，因为每条路径`(i,j)`必须来自任一`(i-1,j)`或者`(i,j-1)`。 

假设最优路径有`a`的因素`2`和`b`的因素`5`。 它的尾随零是`min(a,b)`。 如果`a ≤ b`，那么这条路径是最小化因子的最佳路径`2`。 如果另一条路径更少`2`s，它的尾随零也会更少，这与最优性相矛盾。 对称论证成立`5`s。 所以解决两个独立的DP问题就足够了。 

零处理是正确的，因为任何经过零的路径都会产生乘积`0`，在此问题的上下文中，它恰好贡献了一个尾随零。 仅当每个普通路径至少有两个尾随零时，这样的路径才有意义。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

INF = 10**9

n = int(input())

twos = [[0] * n for _ in range(n)]
fives = [[0] * n for _ in range(n)]

zero_pos = None

for i in range(n):
    row = list(map(int, input().split()))
    
    for j in range(n):
        x = row[j]

        if x == 0:
            zero_pos = (i, j)
            twos[i][j] = INF
            fives[i][j] = INF
            continue

        cnt2 = 0
        while x % 2 == 0:
            cnt2 += 1
            x //= 2

        cnt5 = 0
        while x % 5 == 0:
            cnt5 += 1
            x //= 5

        twos[i][j] = cnt2
        fives[i][j] = cnt5

def build_dp(cost):
    dp = [[INF] * n for _ in range(n)]
    parent = [[''] * n for _ in range(n)]

    dp[0][0] = cost[0][0]

    for i in range(n):
        for j in range(n):
            if i == 0 and j == 0:
                continue

            if i > 0 and dp[i - 1][j] + cost[i][j] < dp[i][j]:
                dp[i][j] = dp[i - 1][j] + cost[i][j]
                parent[i][j] = 'D'

            if j > 0 and dp[i][j - 1] + cost[i][j] < dp[i][j]:
                dp[i][j] = dp[i][j - 1] + cost[i][j]
                parent[i][j] = 'R'

    return dp, parent

dp2, par2 = build_dp(twos)
dp5, par5 = build_dp(fives)

best2 = dp2[n - 1][n - 1]
best5 = dp5[n - 1][n - 1]

best = min(best2, best5)

if zero_pos is not None and best > 1:
    zi, zj = zero_pos

    path = []
    path.extend('D' * zi)
    path.extend('R' * zj)
    path.extend('D' * (n - 1 - zi))
    path.extend('R' * (n - 1 - zj))

    print(1)
    print(''.join(path))

else:
    if best2 < best5:
        parent = par2
        answer = best2
    else:
        parent = par5
        answer = best5

    path = []

    i = n - 1
    j = n - 1

    while i > 0 or j > 0:
        move = parent[i][j]
        path.append(move)

        if move == 'D':
            i -= 1
        else:
            j -= 1

    path.reverse()

    print(answer)
    print(''.join(path))
```预处理阶段将每个网格值转换为因子计数`2`和`5`。 这避免了处理巨大的乘积，并将乘法变成简单的加法。 

零处理有意与普通 DP 分开。 分配`INF`防止优化过程中意外使用零。 随后，我们明确决定零路径是否有益。 

这`build_dp`函数计算网格上的最短路径，其中每个单元格都会贡献成本。 父方向在过渡期间被存储。 一个存储的`'D'`表示从上方到达当前单元格，因此在回溯时重建会向上移动。 

一个微妙的实现细节是从目的地向后重建。 重建期间：```
'D' means we came from above
'R' means we came from the left
```所以在回溯的过程中，`'D'`减少行索引并且`'R'`减少列索引。 

另一个微妙的点是比较：```
if zero_pos is not None and best > 1:
```如果普通最优值已经等于`1`，使用零不会带来任何改进，因此任一答案都是可以接受的。 特殊的零路径仅在严格改善结果时才有意义。 

## 工作示例

 ### 示例 1

 输入：```
3
1 2 3
4 5 6
7 8 9
```因素计为`2`：

 | 细胞| 价值| 数 2 |
 | --- | --- | --- |
 | (0,0) | (0,0) | 1 | 0 |
 | (0,1)| 2 | 1 |
 | (0,2) | 3 | 0 |
 | (1,0)| 4 | 2 |
 | (1,1) | 5 | 0 |
 | (1,2) | 6 | 1 |
 | (2,0) | 7 | 0 |
 | (2,1) | 8 | 3 |
 | (2,2) | 9 | 0 |

 因素计为`5`：

 | 细胞| 价值| 数 5 |
 | --- | --- | --- |
 | (0,0) | (0,0) | 1 | 0 |
 | (0,1)| 2 | 0 |
 | (0,2) | 3 | 0 |
 | (1,0)| 4 | 0 |
 | (1,1) | 5 | 1 |
 | (1,2) | 6 | 0 |
 | (2,0) | 7 | 0 |
 | (2,1) | 8 | 0 |
 | (2,2) | 9 | 0 |

 DP 的因素`5`：

 | 细胞| 最佳成本 |
 | --- | --- |
 | (0,0) | (0,0) | 0 |
 | (0,1)| 0 |
 | (0,2) | 0 |
 | (1,0)| 0 |
 | (1,1) | 1 |
 | (1,2) | 0 |
 | (2,0) | 0 |
 | (2,1) | 0 |
 | (2,2) | 0 |

 最优路径避免了`5`完全，给出零尾随零。 一条有效路线是`DDRR`。 

此示例演示了核心思想，即最小化尾随零相当于最小化总和`2`s 或总计`5`s。 

### 示例 2

 输入：```
2
10 10
10 0
```避免零的普通路径：

 | 路径| 产品 | 尾随零 |
 | --- | --- | --- |
 | 研发| 100 | 100 2 |
 | 博士| 0 | 1 |

 DP 表避免了零，因为它已被分配`INF`。 最好的普通答案变成`2`。 

由于零存在且`2 > 1`，算法手动构建一条经过零的路径。 

| 步骤| 职位| 移动|
 | --- | --- | --- |
 | 开始| (0,0) | (0,0) | d |
 | 下一页 | (1,0)| 右 |
 | 结束 | (1,1) | - |

 输出变为：```
1
DR
```此示例验证了对零单元格的特殊处理。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n²) | 每个 DP 表处理每个单元一次 |
 | 空间| O(n²) | DP 表和父表每个单元格存储一个值 |

 和`n ≤ 1000`，网格最多包含一百万个单元。 在 Python 中，两次 DP 通过网格很容易满足时间限制。 内存使用量也远低于限制，因为每个表仅存储整数或单字符方向。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def solve():
    input = sys.stdin.readline

    INF = 10**9

    n = int(input())

    twos = [[0] * n for _ in range(n)]
    fives = [[0] * n for _ in range(n)]

    zero_pos = None

    for i in range(n):
        row = list(map(int, input().split()))

        for j in range(n):
            x = row[j]

            if x == 0:
                zero_pos = (i, j)
                twos[i][j] = INF
                fives[i][j] = INF
                continue

            cnt2 = 0
            while x % 2 == 0:
                cnt2 += 1
                x //= 2

            cnt5 = 0
            while x % 5 == 0:
                cnt5 += 1
                x //= 5

            twos[i][j] = cnt2
            fives[i][j] = cnt5

    def build(cost):
        dp = [[INF] * n for _ in range(n)]
        par = [[''] * n for _ in range(n)]

        dp[0][0] = cost[0][0]

        for i in range(n):
            for j in range(n):
                if i == 0 and j == 0:
                    continue

                if i > 0 and dp[i - 1][j] + cost[i][j] < dp[i][j]:
                    dp[i][j] = dp[i - 1][j] + cost[i][j]
                    par[i][j] = 'D'

                if j > 0 and dp[i][j - 1] + cost[i][j] < dp[i][j]:
                    dp[i][j] = dp[i][j - 1] + cost[i][j]
                    par[i][j] = 'R'

        return dp, par

    dp2, par2 = build(twos)
    dp5, par5 = build(fives)

    best2 = dp2[n - 1][n - 1]
    best5 = dp5[n - 1][n - 1]

    best = min(best2, best5)

    out = []

    if zero_pos is not None and best > 1:
        zi, zj = zero_pos

        path = []
        path.extend('D' * zi)
        path.extend('R' * zj)
        path.extend('D' * (n - 1 - zi))
        path.extend('R' * (n - 1 - zj))

        out.append("1")
        out.append(''.join(path))

    else:
        if best2 < best5:
            par = par2
            ans = best2
        else:
            par = par5
            ans = best5

        path = []

        i = n - 1
        j = n - 1

        while i > 0 or j > 0:
            move = par[i][j]
            path.append(move)

            if move == 'D':
                i -= 1
            else:
                j -= 1

        path.reverse()

        out.append(str(ans))
        out.append(''.join(path))

    print('\n'.join(out))

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()

    return sys.stdout.getvalue()

# provided sample
assert run(
"""3
1 2 3
4 5 6
7 8 9
"""
).startswith("0")

# minimum size
assert run(
"""2
1 1
1 1
"""
).startswith("0")

# zero gives better answer
assert run(
"""2
10 10
10 0
"""
).startswith("1")

# all equal values
assert run(
"""3
10 10 10
10 10 10
10 10 10
"""
).startswith("5")

# path with no trailing zeros exists
assert run(
"""3
2 4 8
16 32 64
3 9 27
"""
).startswith("0")
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`2×2`网格 |`0`尾随零 | 最小尺寸边界|
 | 包含有益零的网格|`1`尾随零 | 正确的零处理 |
 | 所有值等于`10`|`5`尾随零 | 因素积累|
 | 具有纯功率的网格`2`除一行 |`0`尾随零 | 避免不必要的`5`s |

 ## 边缘情况

 考虑网格：```
2
10 10
10 0
```每条普通路径至少积累两个因素`2`和两个因素`5`，给出两个尾随零。 在预处理过程中，零单元接收成本`INF`，所以 DP 避免它并计算答案`2`。 

然后算法检查：```
zero exists AND best > 1
```这两个条件都成立，因此它构建了一条经过零的路线：```
DR
```产品变成`10 × 10 × 0 = 0`，它恰好产生一个尾随零。 最后的答案是正确的。 

现在考虑：```
2
1 1
1 0
```非零路径已经实现了零尾随零。 DP结果变为`0`。 

即使零存在，条件`best > 1`失败。 该算法正确地忽略了零路径，因为穿过零会使答案变得更糟`0`到`1`。 

最后，考虑平局的情况：```
2
2 5
5 2
```两条路径都产生一个尾随零。 在重建过程中，父母的选择都是可以接受的。 该算法始终如一地重建一条有效的最佳路径，因为每个 DP 转换都存储用于实现最小成本的实际前驱路径。
