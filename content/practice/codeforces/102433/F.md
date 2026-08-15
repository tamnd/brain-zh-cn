---
title: "CF 102433F - 卡尼魔术师"
description: "我们需要将 (1) 到 (n) 的数字排列成排列。 当放置在那里的值也是(i)时，位置(i)被称为固定的。 在所有具有恰好 (m) 个固定位置的排列中，我们必须按字典顺序输出第 (k) 个排列。"
date: "2026-08-14T15:36:35+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102433
codeforces_index: "F"
codeforces_contest_name: "2019-2020 ACM-ICPC Pacific Northwest Regional Contest (Div. 1)"
rating: 0
weight: 102433
solve_time_s: 137
verified: true
draft: false
---

[CF 102433F - 卡尼魔术师](https://codeforces.com/problemset/problem/102433/F)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 17s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们需要将 (1) 到 (n) 的数字排列成排列。 当放置在那里的值也是(i)时，位置(i)被称为固定的。 在所有具有恰好 (m) 个固定位置的排列中，我们必须按字典顺序输出第 (k) 个排列。 如果存在少于 (k) 个有效排列，则答案为 (-1)。 

(n) 中的约束很小，为 (n\le 50)，但排列的数量却很大。 即使在 (n=50) 时，也存在 (50!\approx3.04\cdot10^{64}) 个排列，因此任何枚举排列的方法都是完全不可行的。 秩（k）可以达到（10^{18}），这意味着普通的64位整数足以满足输入秩，但中间计数值可以大得多。 我们只需要区分低于 (k) 的计数和至少 (k) 的计数，因此所有 DP 值都可以安全地限制在 (10^{18})。 

直接构造可能会错误处理几种边缘情况。 用于输入`1 0 1`，唯一的排列是`[1]`，但它有一个固定点，所以正确的输出是`-1`。 简单地填充唯一可用值的构造会错误地接受它。 

用于输入`3 2 1`，所需的固定点数是两个。 如果两个位置是固定的，则最后一个位置也被迫包含其自己的值，因此恰好有两个固定点是不可能的。 正确的输出是`-1`。 独立选择固定位置而不计算剩余排列的方法可能会犯这个错误。 

用于输入`4 0 3`，所有固定点均被禁止。 有九种混乱，按字典顺序排列第三小的一种是`2 4 1 3`。 仅仅避免将 (i) 放置在位置 (i) 的贪心规则不知道剩余的值是否仍然可以完成排列，因此它可以选择一个稍后变得不可能的前缀。 

最后一个边缘情况是 (m=n)。 确切地说，存在一种有效的排列，即恒等排列。 例如，`4 4 1`必须产生`1 2 3 4`， 尽管`4 4 2`必须产生`-1`。 

## 方法

 直接的方法是按字典顺序生成每个排列，计算其固定点，并在找到第 (k) 个有效点时停止。 这是正确的，因为生成的顺序正是所需的顺序，但在最坏的情况下，我们检查所有 (n!) 个排列并检查每个排列中的 (n) 个位置。 最坏情况的工作是 (O(n\cdot n!))，对于 (n=50) 来说大约是 (50\cdot50!\approx1.52\cdot10^{66}) 位置检查。 即使单独生成排列也是不可能的。 

有用的观察是，未来并不取决于所有剩余值的确切身份。 重要的是还有多少剩余职位仍然具有其自身的价值。 

假设还剩下 (s) 个位置和 (s) 个未使用的值。 如果某个位置自身的编号在未使用的值中，则称该位置可匹配。 令 (a) 为可匹配位置的数量。 为了计算具有指定数量的固定点的完成情况，具有相同 (s)、(a) 和所需固定点数量的每个状态都是等效的。 实际的标签并不重要。 

将 (dp[s][a][r]) 定义为使用 (s) 个位置完成此类状态的方法数量，其中恰好 (a) 个位置具有其自己的可用值，并且这些位置中的 (r) 个位置必须固定。 

要导出递归，请选择一个特定的匹配位置。 它的值可以通过三种方式分配。 它可以接收自己的值，创建一个固定点并将 (a) 减一。 它可以接收一个其对应位置不在剩余位置中的值。 存在 (s-a) 个这样的值，删除它们会使 (a) 减一。 最后，它可以接收属于另一个可匹配位置的值。 有 (a-1) 个这样的选择，并且删除所选位置和该值会使 (a) 减少 2。 

这给出了

 dp[s-1][a-1][r-1]
 +
 (s-a),dp[s-1][a-1][r]
 +
 (a-1),dp[s-1][a-2][r]。 
]

 当(a=0)时，没有剩余位置可以变得固定，因此(dp[s][0][0]=s!)，而(dp[s][0][r]=0)对于(r>0)。 

然后，同一个 DP 可以指导词典编排。 在每个位置，从小到大尝试未使用的值。 对于每个候选，计算 (a) 的新值，然后询问 DP 还剩下多少个有效的完成。 如果该计数至少为 (k)，则候选属于所需的排列。 否则，从该候选开始的每个排列都在答案之前，因此我们从 (k) 中减去计数并尝试下一个候选。 

蛮力方法之所以有效，是因为它显式地枚举了每个可能的延续，但它失败了，因为它们的阶乘数量很多。 完成计数仅取决于 (s)、(a) 和 (r) 的观察结果将所有这些延续压缩为多项式大小的 DP。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(n\cdot n!)) | (O(n)) | (O(n)) | 太慢了 |
 | 最佳 | (O(n^3+n^3\log n)) | (O(n^3)) | 已接受 |

 构造中的对数因子来自于对最多 50 个未使用的值进行重复排序。 也可以通过维护有序结构来避免这种情况，但与此约束大小无关。 

## 算法演练

 1. 构建DP表(dp[s][a][r])。 基本状态为(dp[0][0][0]=1)。 对于每个 (a=0) 的状态，设置 (dp[s][0][0]=s!)。 对于 (a>0)，使用上面的三种情况递归。 每个计数的上限为 (10^{18})，因为与 (k) 进行比较时无法区分较大的值。 
2. 从未使用的所有位置和所有值开始。 最初(s=n)、(a=n)，因为每个位置仍然有其自己的可用值。 有效排列的总数为 (dp[n][n][m])。 如果小于(k)，则立即打印`-1`。 
3. 处理从 (1) 到 (n) 的位置。 在位置 (i) 处，按升序考虑每个当前未使用的值 (x)。 这种排序正是字典顺序所要求的。 
4. 确定选择 (x) 是否创建不动点。 它恰好在 (x=i) 时发生。 仍然需要的固定点数变为(m-[x=i])。 
5. 删除位置 (i) 和值 (x) 后计算新的可匹配位置数。 如果(x=i)，则一个可匹配的位置消失，因此新的计数为(a-1)。 否则，当位置(i)仍然是未使用的值时，删除位置(i)正好删除一个可匹配的位置，并且当位置(x)仍未处理时，删除值(x)正好删除一个可匹配的位置。 
6. 候选人离开 (n-i) 个职位。 使用剩余位置、新计算的可匹配计数以及所需固定点的剩余数量查询 DP。 该计数正是其前缀等于当前前缀后跟 (x) 的有效排列的数量。 
7. 如果该计数小于 (k)，则跳过整个字典块并从 (k) 中减去该计数。 否则，提交 (x)，从剩余集合中删除 (i) 和 (x)，更新 (a) 和 (m)，然后继续下一个位置。 
8、处理完所有位置后，构建的序列是第（k）个有效排列。 

不变量是，在处理位置 (i) 之前，(k) 是当前前缀的所有有效完成中所需答案的排名，并且 (dp) 精确计算每个候选延续的这些完成。 当跳过候选块时，其整个块位于答案之前，因此减去其大小可以保留不变式。 当候选人被接受时，答案必须位于该块内，因此相同的不变量适用于较小的状态。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

LIMIT = 10**18

def build_dp(n):
    # dp[s][a][r]:
    # number of completions with s positions left,
    # a matchable positions, and exactly r fixed points.
    dp = [[[0] * (n + 1) for _ in range(n + 1)]
          for _ in range(n + 1)]

    dp[0][0][0] = 1

    fact = [1] * (n + 1)
    for i in range(1, n + 1):
        fact[i] = min(LIMIT, fact[i - 1] * i)

    for s in range(1, n + 1):
        dp[s][0][0] = fact[s]

    for s in range(1, n + 1):
        for a in range(1, s + 1):
            for r in range(0, a + 1):
                value = 0

                # The chosen matchable position is fixed.
                if r >= 1:
                    value += dp[s - 1][a - 1][r - 1]

                # It receives a value whose position is not matchable.
                if s - a > 0:
                    value += (s - a) * dp[s - 1][a - 1][r]

                # It receives the value of another matchable position.
                if a >= 2:
                    value += (a - 1) * dp[s - 1][a - 2][r]

                dp[s][a][r] = min(LIMIT, value)

    return dp

def solve_instance(n, m, k):
    dp = build_dp(n)

    if dp[n][n][m] < k:
        return "-1"

    remaining_positions = set(range(1, n + 1))
    remaining_values = set(range(1, n + 1))

    a = n
    answer = []

    for pos in range(1, n + 1):
        s = n - pos + 1

        chosen = False

        for x in sorted(remaining_values):
            fixed = (x == pos)
            remaining_fixed = m - fixed

            if x == pos:
                new_a = a - 1
            else:
                new_a = a
                if pos in remaining_values:
                    new_a -= 1
                if x in remaining_positions:
                    new_a -= 1

            if remaining_fixed < 0:
                count = 0
            else:
                count = dp[s - 1][new_a][remaining_fixed]

            if count < k:
                k -= count
                continue

            answer.append(x)
            remaining_positions.remove(pos)
            remaining_values.remove(x)

            a = new_a
            m = remaining_fixed
            chosen = True
            break

        if not chosen:
            return "-1"

    return " ".join(map(str, answer))

def main():
    n, m, k = map(int, input().split())
    print(solve_instance(n, m, k))

if __name__ == "__main__":
    main()
```这`build_dp`函数实现算法中描述的状态。 分开的`a=0`初始化是必要的，因为递归选择了一个可匹配的位置，而该位置在该状态下不存在。 当未来不可能有固定点时，阶乘值表示所有不受限制的排列。 

递归中的三个项直接对应于所选可匹配位置的三个可能目的地。 乘法因子计算有多少个值属于每个类别。 该表只需要到 (n) 的索引，因此它的维度很小。 

这`LIMIT`cap 防止 Python 整数不必要的增长。 实际的排列数量可以大到 (50!)，但在构造过程中提出的唯一问题是块是否包含少于 (k) 个排列。 由于 (k\le10^{18})，用 (10^{18}) 替换每个较大的计数可以保留每个决策。 

施工期间，`remaining_positions`和`remaining_values`代表确切的状态。 变量`a`存储其自身值仍未使用的位置数量。 表达式为`new_a`分别考虑删除当前位置和删除候选值。 什么时候`x == pos`，两次删除都涉及相同的可匹配对，因此只需减去一次。 

对比是故意的`count < k`而不是`count <= k`。 如果候选块恰好包含 (k) 个有效补全，则所需的排列位于该块内，并且必须选择候选块。 这是第 (k) 词典结构中最常见的差一错误。 

Python 整数不会溢出，但显式上限使 DP 值保持较小并使预期的比较语义清晰。 

## 工作示例

 ### 示例 1

 用于输入`3 1 1`，我们需要一个固定点并想要第一个有效排列。 

| 职位| 候选人| 剩余职位 | 可匹配 (一) | 需要固定点| 竣工 | 行动|
 | --- | --- | --- | --- | --- | --- | --- |
 | 1 | 1 | 2 | 2 | 0 | 1 | 选择|
 | 2 | 2 | 1 | 1 | -1 | 0 | 跳过|
 | 2 | 3 | 1 | 0 | 0 | 1 | 选择|
 | 3 | 2 | 0 | 0 | 0 | 1 | 选择|

 最初有 (dp[3][3][1]=3) 个有效排列。 最小可能的第一个值是`1`。 如果我们选择它，剩下的两个位置必须不包含额外的固定点，唯一的完成是`1 3 2`。 由于该块包含第一个所需的排列，因此我们选择`1`。 

在位置 2 处，选择`2`将创建第二个固定点，因此其完成计数为零。 选择`3`留下唯一可能的完成`2`在最后一个位置。 结果是`1 3 2`。 

### 示例 2

 用于输入`3 2 1`，初始状态有三个可匹配的位置，并且需要恰好两个固定点。 

| 状态| (s) | （一）| 所需固定点 | 计数 |
 | --- | --- | --- | --- | --- |
 | 初始| 3 | 3 | 2 | 0 |

 计数为零，因为从三元素排列中精确选择两个固定点是不可能的。 一旦两个位置固定，剩余值就会被强制转移到剩余位置，从而创建第三个固定点。 

由于初始计数已经小于 (k=1)，因此算法打印`-1`无需尝试构建。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(n^3+n^3\log n)) | DP 有 (O(n^3)) 个状态，每个状态都需要不断做功。 构造在每个 (n) 个位置最多尝试 (n) 个候选，每次最多排序 (n) 个值。 |
 | 空间| (O(n^3)) | DP 表有 (O(n^3)) 个条目，而构造状态使用 (O(n)) 个额外空间。 |

 对于 (n\le50)，DP 仅包含大约 (51^3) 个条目，并且该构造最多检查几千个候选状态。 对于一秒的限制来说，这很容易足够小，而暴力破解则与可行范围相差数十个数量级。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

LIMIT = 10**18

def build_dp(n):
    dp = [[[0] * (n + 1) for _ in range(n + 1)]
          for _ in range(n + 1)]

    dp[0][0][0] = 1

    fact = [1] * (n + 1)
    for i in range(1, n + 1):
        fact[i] = min(LIMIT, fact[i - 1] * i)

    for s in range(1, n + 1):
        dp[s][0][0] = fact[s]

    for s in range(1, n + 1):
        for a in range(1, s + 1):
            for r in range(a + 1):
                value = 0

                if r >= 1:
                    value += dp[s - 1][a - 1][r - 1]

                if s - a > 0:
                    value += (s - a) * dp[s - 1][a - 1][r]

                if a >= 2:
                    value += (a - 1) * dp[s - 1][a - 2][r]

                dp[s][a][r] = min(LIMIT, value)

    return dp

def solve_instance(n, m, k):
    dp = build_dp(n)

    if dp[n][n][m] < k:
        return "-1"

    remaining_positions = set(range(1, n + 1))
    remaining_values = set(range(1, n + 1))

    a = n
    answer = []

    for pos in range(1, n + 1):
        s = n - pos + 1

        for x in sorted(remaining_values):
            fixed = (x == pos)
            remaining_fixed = m - fixed

            if x == pos:
                new_a = a - 1
            else:
                new_a = a
                if pos in remaining_values:
                    new_a -= 1
                if x in remaining_positions:
                    new_a -= 1

            count = 0
            if remaining_fixed >= 0:
                count = dp[s - 1][new_a][remaining_fixed]

            if count < k:
                k -= count
                continue

            answer.append(x)
            remaining_positions.remove(pos)
            remaining_values.remove(x)

            a = new_a
            m = remaining_fixed
            break

    return " ".join(map(str, answer))

def run(inp: str) -> str:
    n, m, k = map(int, inp.split())
    return solve_instance(n, m, k)

# Provided samples
assert run("3 1 1") == "1 3 2", "sample 1"
assert run("3 2 1") == "-1", "sample 2"
assert run("5 3 7") == "2 1 3 4 5", "sample 3"

# Minimum size, but the requested fixed-point count is impossible.
assert run("1 0 1") == "-1", "single element with zero fixed points"

# Minimum size with the only possible fixed-point count.
assert run("1 1 1") == "1", "single element identity"

# Third lexicographically smallest derangement of size 4.
assert run("4 0 3") == "2 4 1 3", "derangement ranking"

# Maximum n, all positions fixed.
assert run("50 50 1") == " ".join(map(str, range(1, 51))), "maximum size identity"

# n - 1 fixed points are impossible for n > 1.
assert run("4 3 1") == "-1", "n-1 fixed points"

# Smallest derangement of size 2.
assert run("2 0 1") == "2 1", "two-element derangement"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 0 1`|`-1`| 最小尺寸和不可能的定点目标 |
 |`1 1 1`|`1`| 具有唯一有效排列的最小大小 |
 |`4 0 3`|`2 4 1 3`| (k) 精神错乱排名 |
 |`50 50 1`|`1 2 3 ... 50`| 最大值 (n)，所有位置固定 |
 |`4 3 1`|`-1`| 不可能的 (n-1) 个不动点 |
 |`2 0 1`|`2 1`| 最小的非平凡紊乱和边界转变|

 ## 边缘情况

 对于`1 0 1`，初始状态为(s=1,a=1,r=0)。 唯一可能的值是`1`，但选择它会创建一个定点，留下所需的定点计数 (-1)。 它的完成计数为零，因此初始状态没有有效的排列，算法输出`-1`。 

为了`3 2 1`，DP 从 (dp[3][3][2]) 开始。 不存在具有恰好两个固定点的三个元素的排列，因此该条目为零。 该算法在构造前缀和输出之前拒绝整个实例`-1`。 

为了`4 4 1`，初始状态为(dp[4][4][4]=1)。 每个位置都必须是固定的，所以第一个候选人`1`被选中，那么`2`， 然后`3`， 然后`4`。 结果是`1 2 3 4`。 如果输入要求`4 4 2`，初始计数为 1，小于 (k=2)，因此算法输出`-1`。 

为了`4 3 1`，目标比位置数少 1。 如果前三个位置固定，则最终未使用的值必然是`4`，创建另一个固定点。 DP 捕获这种依赖性，而不是独立处理固定位置，因此 (dp[4][4][3]=0) 并且算法正确打印`-1`。 

为了`4 0 3`，施工时必须避开各个固定点。 第一候选人`1`被拒绝，因为它立即创建一个固定点。 第一个有效前缀是`2`，然后 DP 比较从以下开始的有效完成`2`按字典顺序。 前三个是`2 1 4 3`,`2 3 4 1`， 和`2 4 1 3`，所以第三个答案是`2 4 1 3`。 这说明了为什么即使候选者本身没有创建固定点，也需要对完成情况进行计数。
