---
title: "CF 102700I - 令人难以置信的摄影"
description: "我们有一排 (n) 栋建筑物，其中建筑物 (i) 的高度为 (hi)。 宝拉可以从任何建筑物开始，然后反复移动到严格高于她当前建筑物并且从该建筑物可见的建筑物。"
date: "2026-08-16T17:54:24+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102700
codeforces_index: "I"
codeforces_contest_name: "2020 ICPC Universidad Nacional de Colombia Programming Contest"
rating: 0
weight: 102700
solve_time_s: 153
verified: true
draft: false
---

[CF 102700I - 令人难以置信的摄影](https://codeforces.com/problemset/problem/102700/I)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 33s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一排 (n) 栋建筑物，其中建筑物 (i) 的高度为 (h_i)。 宝拉可以从任何建筑物开始，然后反复移动到严格高于她当前建筑物并且从该建筑物可见的建筑物。 如果她从 (i) 移动到 (j)，则添加到她步行中的距离为 (|i-j|)。 

当建筑物 (j) 严格位于建筑物 (j) 之间的高度最大为 (h_j) 时，从 (i) 可见。 与 (j) 高度相同的建筑物不会遮挡视线，因为只有严格更高的建筑物才会遮挡视线。 

对于每个起始建筑物 (i)，我们需要任何有效移动序列的最大总距离。 由于每次移动都会到达严格更高的建筑物，因此有效路线永远无法返回到之前的高度，因此移动图是非循环的。 

重要的约束是 (n\le 10^5)。 在最坏的情况下， (O(n^2)) 算法已经执行了大约 (5\cdot10^9) 对检查，这远远超出了一秒限制可以处理的范围。 我们需要一个 (O(n\log n)) 或更好的解决方案。 高度可以大到（10^9），但它们只参与比较，因此它们的大小不会影响数据结构。 

在几种边界情况下，实现可能会默默地出错。 以单栋建筑为例，`1 / 15`有答案`0`，因为没有地方可以移动。 假设每个建筑物都有左侧或右侧候选者的实现可以访问无效索引。 

相同的高度需要更多的照顾。 为了`3 / 1 3 3`，答案是`2 0 0`。 第一个建筑物可以看到两座高度为 (3) 的建筑物，包括较远的建筑物，因为较近的高度 (3) 建筑物并不严格高于较远的建筑物，因此不会阻挡它。 仅基于最近的严格较高建筑物的方法将错误地仅考虑第一个 (3)。 

这两个方向也必须独立处理。 为了`3 / 5 4 3`，正确答案是`0 1 2`。 建筑物 (2) 可以向左移动到建筑物 (1)，距离 (2)，但向右移动则无效。 仅向右搜索的实现会错过所有这些路线。 

## 方法

 直接动态规划解决方案将考虑每一个可能的下一个建筑。 对于固定建筑物 (i)，在保持遇到的最大高度的同时向右扫描，并向左侧执行相同操作。 每当可见更高的建筑物 (j) 时，就会产生过渡

 [
 dp[i] = \max(dp[i], |i-j|+dp[j])。 
]

 建筑物可以按照递减的高度进行处理，因此只要 (j) 高于 (i)，(dp[j]) 就已知。 这种蛮力是正确的，因为它明确考虑了每一个合法的第一步。 

问题在于候选人的数量。 考虑严格增加高度。 从每栋建筑中，都可以看到其右侧的每栋建筑。 该算法必须检查

 [
 \frac{n(n-1)}2
 ]

 候选对，当（n=100000）时为（4,999,950,000）对。 如果每次都扫描对之间的建筑物，则对每对的直接可见性检查可能会更糟，达到 (O(n^3))。 

有用的观察是我们可以逆转这种转变。 修复一座较高的建筑物 (j)，并询问哪些较低的建筑物可以看到它。 

令 (L_j) 为其左侧严格高于 (j) 的最近建筑物。 那么每座建筑（i）都满足

 [
 L_j < i < j
 ]

 并且(h_i<h_j)可以看到(j)。 (i) 和 (j) 之间不可能有高于 (h_j) 的建筑物，因为 (L_j) 是最近的此类建筑物。 相反，如果 (i\le L_j)，建筑物 (L_j) 会遮挡 (j) 的视野。 

同样的论点也适用于右边。 如果 (R_j) 是右侧最近的严格更高的建筑物，则每个较低的建筑物 (i)

 [
 j<i<R_j
 ]

 可以看到(j)。 

这会将一栋建筑物 (j) 转换为两个范围更新。 对于较低的建筑物 (i<j)，通过 (j) 的过渡具有值

 [
 dp[j]+j-i=(dp[j]+j)-i。 
]

 该表达式的形式为常量减 (i)，因此我们可以将常量 (dp[j]+j) 存储在一个区间上。 对于较低的建筑物 (i>j)，过渡为

 [
 dp[j]+i-j=(dp[j]-j)+i,
 ]

 所以我们将 (dp[j]-j) 存储在另一个区间。 

范围最大更新后跟点查询就足够了。 我们通过降低高度来处理建筑物。 在任何相同高度的建筑物更新数据结构之前都会查询所有建筑物。 此细节可以正确处理等高，因为不允许 Paula 在等高建筑物之间移动。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(n^2)) | (O(n)) | (O(n)) | 太慢了 |
 | 最佳 | (O(n\log n)) | (O(n)) | (O(n)) | 已接受 |

 ## 算法演练

1. 计算 (L_i)，其高度严格大于 (h_i) 的最靠近左侧的索引。 递减单调堆栈在 (O(n)) 中找到所有这些位置。 虽然堆栈顶部的高度最多为 (h_i)，但请将其删除，因为它不可能是距离 (i) 最接近的严格更大的建筑物。 
2. 使用相同的单调堆栈思想，同时从右向左扫描，计算 (R_i)，即距离右侧最近且高度严格大于 (h_i) 的索引。 如果不存在这样的建筑物，则使用 (n) 作为哨兵。 
3. 按高度降序对建筑物索引进行排序。 高度相同的建筑物保留在同一组中。 我们需要这种分组，因为高度 (H) 的建筑物只能移动到严格大于 (H) 的高度，而永远不会移动到高度 (H) 的另一建筑物。 
4. 为从右侧的移动维持一种范围-chmax 结构，为从左侧的移动维持另一种范围-chmax 结构。 第一个结构存储值 (dp[j]+j)，第二个结构存储值 (dp[j]-j)。 (i) 处的点查询给出适用于 (i) 的最佳存储常数。 
5. 对于当前高度组中的每个建筑物 (i)，在应用该组的任何更新之前查询两个结构。 如果左视结构返回(A)，则对应的路由值为(A-i)。 如果右视结构返回(B)，则对应的路由值为(B+i)。 将 (dp[i]) 设置为这些值中的最大值和零。 
6. 当前高度组中的所有建筑物都有其 (dp) 值后，更新每个建筑物 (j) 的结构。 左边的间隔是([L_j+1,j))，因为这些是左边可以看到(j)的位置。 将 (dp[j]+j) 存储在那里。 右边的区间是([j+1,R_j))，我们在那里存储(dp[j]-j)。 
7. 处理完所有高度组后，打印结果 (dp) 数组。 用于计算值的每个转换都来自一座严格更高的建筑物，其答案已经最终确定。 

### 为什么它有效

 考虑从较低建筑物 (i) 到较高建筑物 (j) 的任何合法过渡（i<j）。 当它们之间不存在严格高于 (h_j) 的建筑物时，转换准确有效。 根据定义，(L_j) 是左侧最近的此类建筑物，因此此条件等效于 (L_j<i<j)。 因此，(j) 生成的更新恰好覆盖了其左侧的有效较低建筑物。 右侧是对称的。 

对于每个这样的转换，数据结构都会存储 (dp[j]+j)，因此 (i) 处的查询会重建 (dp[j]+j-i)，即距离 (j-i) 加上从 (j) 开始的最佳路线。 由于来自较高高度组的所有更新都已应用，因此在计算 (dp[i]) 时表示每个可能的第一步。 不允许移动等高建筑物，并且延迟等高组的所有更新可以防止它们相互影响。 因此，每栋建筑产生的最大值正是最大合法步行距离。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

NEG = -10**30

class RangeChmaxPointQuery:
    def __init__(self, n):
        size = 1
        while size < n:
            size <<= 1
        self.size = size
        self.tree = [NEG] * (2 * size)

    def update(self, left, right, value):
        if left >= right:
            return

        size = self.size
        tree = self.tree

        left += size
        right += size

        while left < right:
            if left & 1:
                if value > tree[left]:
                    tree[left] = value
                left += 1

            if right & 1:
                right -= 1
                if value > tree[right]:
                    tree[right] = value

            left >>= 1
            right >>= 1

    def query(self, pos):
        tree = self.tree
        pos += self.size
        result = NEG

        while pos:
            if tree[pos] > result:
                result = tree[pos]
            pos >>= 1

        return result

def solve():
    n = int(input())
    h = list(map(int, input().split()))

    left_greater = [-1] * n
    right_greater = [n] * n

    stack = []

    for i in range(n):
        while stack and h[stack[-1]] <= h[i]:
            stack.pop()

        if stack:
            left_greater[i] = stack[-1]

        stack.append(i)

    stack = []

    for i in range(n - 1, -1, -1):
        while stack and h[stack[-1]] <= h[i]:
            stack.pop()

        if stack:
            right_greater[i] = stack[-1]

        stack.append(i)

    order = sorted(range(n), key=h.__getitem__, reverse=True)

    left_tree = RangeChmaxPointQuery(n)
    right_tree = RangeChmaxPointQuery(n)

    dp = [0] * n

    p = 0
    while p < n:
        q = p + 1
        height = h[order[p]]

        while q < n and h[order[q]] == height:
            q += 1

        for k in range(p, q):
            i = order[k]

            best = 0

            a = left_tree.query(i)
            if a != NEG:
                candidate = a - i
                if candidate > best:
                    best = candidate

            b = right_tree.query(i)
            if b != NEG:
                candidate = b + i
                if candidate > best:
                    best = candidate

            dp[i] = best

        for k in range(p, q):
            j = order[k]

            left_tree.update(
                left_greater[j] + 1,
                j,
                dp[j] + j
            )

            right_tree.update(
                j + 1,
                right_greater[j],
                dp[j] - j
            )

        p = q

    print(*dp)

if __name__ == "__main__":
    solve()
```第一个单调堆栈遍历计算左侧最近的严格更高的建筑物。 这`<=`比较是经过深思熟虑的。 严格来说，等高的建筑物不算更高，因此必须在选择最近的有效阻挡物之前将其从堆栈中删除。 

第二遍对右边界进行对称计算。 使用`n`由于缺少右边界使得后面的范围更新自然变成`[j+1,n)`无需特殊处理。 

这`RangeChmaxPointQuery`结构使用迭代线段树。 它不需要通常意义上的延迟传播，因为更新只是范围最大分配，而查询只是点。 范围被分解为 (O(\log n)) 个规范树节点，点查询在其根路径上的 (O(\log n)) 个节点上获取最大值。 

两棵树代表着距离的两个标志。 对于 (i) 右侧的目的地 (j)，表达式为`dp[j] + j - i`，所以存储的值为`dp[j] + j`。 对于左边的目的地 (j)，它是`dp[j] - j + i`，所以存储的值为`dp[j] - j`。 

等高组内查询和更新的顺序至关重要。 如果高度 (H) 建筑物在处理另一个高度 (H) 建筑物之前更新结构，则第二个建筑物可能会错误地使用第一个建筑物作为目的地。 首先处理整个组可以防止这种情况发生。 

Python 整数具有任意精度，因此潜在的大累积步行距离不会溢出。 在固定宽度语言中，应使用 64 位整数类型。 

## 工作示例

 ### 示例 1

 对于输入```
4
3 1 2 4
```最近的严格更大边界是

 [
 L=[-1,0,0,0]
 ]

 和

 [
 R=[3,2,3,4]。 
]

 下表显示了处理高度组时的重要状态。 这`left query`表示存储的(dp[j]+j)，而`right query`表示存储的(dp[j]-j)。 

| 身高组| 建筑| 左查询 | 正确查询 | (dp)|
 | ---| ---| ---| ---| ---|
 | 4 | 3 | 无 | 无 | 0 |
 | 3 | 0 | 无 | 3 | 3 |
 | 2 | 2 | 3 | 3 | 5 |
 | 1 | 1 | 7 | 3 | 6 |

 在处理高度为 (4) 的构建 (3) 后，其左侧更新将 (dp[3]+3=3) 存储在位置 (0,1,2) 上。 因此建筑物(0)已经可以获得距离(3)。 

当建筑物（0）被处理时，它的答案变成（3）。 它的右更新将 (dp[0]-0=3) 存储在位置 (1,2) 上。 在建筑物 (2) 处，给出 (3+2=5)，对应于路线 (2\to0\to3)。 

最后，建筑物(2)对其左侧区间贡献(dp[2]+2=7)，因此建筑物(1)得到(7-1=6)。 结果输出是`3 6 5 0`。 

### 示例 2

 对于输入```
5
3 3 1 5 5
```最近的严格更大边界是

 [
 L=[-1,-1,1,-1,-1]
 ]

 和

 [
 R=[3,3,3,5,5]。 
]

 两座高度为 (5) 的建筑物必须一起处理。 它们的更新仅在两者都获得（dp=0）之后发生。 

| 身高组| 建筑| 左查询 | 正确查询 | (dp)|
 | ---| ---| ---| ---| ---|
 | 5 | 3 | 无 | 无 | 0 |
 | 5 | 4 | 无 | 无 | 0 |
 | 3 | 0 | 4 | 无 | 4 |
 | 3 | 1 | 4 | 无 | 3 |
 | 1 | 2 | 4 | 4 | 6 |

 高度为 (5) 的建筑物 (4) 将其左侧的每个较低建筑物更新为值 (dp[4]+4=4)。 这就是为什么建筑物（1）可以直接看到更远的高度（5）建筑物并获得距离（3），即使它们之间有另一个高度（5）建筑物。 

处理建筑物 (0) 和 (1) 后，它们的右侧更新使得建筑物 (2) 的最佳路线等于 (6)。 一条最佳路线是 (2\to0\to4)，距离为 (2) 和 (4)。 

最终输出是`4 3 6 0 0`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(n\log n)) | 排序需要 (O(n\log n))，而每个建筑物都会执行恒定数量的 (O(\log n)) 线段树操作。 |
 | 空间| (O(n)) | (O(n)) | 高度数组、边界数组、DP数组、堆栈和两段树都使用线性空间。 |

 对于 (n\le10^5)，该解决方案在排序步骤后仅对每个建筑物执行对数数量的操作。 这完全在预期的渐进界限内，而线性内存使用量远低于 512 MB 限制。 

## 测试用例```python
import sys
import io

NEG = -10**30

class RangeChmaxPointQuery:
    def __init__(self, n):
        size = 1
        while size < n:
            size <<= 1
        self.size = size
        self.tree = [NEG] * (2 * size)

    def update(self, left, right, value):
        if left >= right:
            return

        left += self.size
        right += self.size

        while left < right:
            if left & 1:
                self.tree[left] = max(self.tree[left], value)
                left += 1

            if right & 1:
                right -= 1
                self.tree[right] = max(self.tree[right], value)

            left >>= 1
            right >>= 1

    def query(self, pos):
        pos += self.size
        result = NEG

        while pos:
            result = max(result, self.tree[pos])
            pos >>= 1

        return result

def solve_data(data: str) -> str:
    tokens = list(map(int, data.split()))
    n = tokens[0]
    h = tokens[1:n + 1]

    left_greater = [-1] * n
    right_greater = [n] * n

    stack = []

    for i in range(n):
        while stack and h[stack[-1]] <= h[i]:
            stack.pop()

        if stack:
            left_greater[i] = stack[-1]

        stack.append(i)

    stack = []

    for i in range(n - 1, -1, -1):
        while stack and h[stack[-1]] <= h[i]:
            stack.pop()

        if stack:
            right_greater[i] = stack[-1]

        stack.append(i)

    order = sorted(range(n), key=h.__getitem__, reverse=True)

    left_tree = RangeChmaxPointQuery(n)
    right_tree = RangeChmaxPointQuery(n)
    dp = [0] * n

    p = 0
    while p < n:
        q = p + 1

        while q < n and h[order[q]] == h[order[p]]:
            q += 1

        for k in range(p, q):
            i = order[k]
            best = 0

            a = left_tree.query(i)
            if a != NEG:
                best = max(best, a - i)

            b = right_tree.query(i)
            if b != NEG:
                best = max(best, b + i)

            dp[i] = best

        for k in range(p, q):
            j = order[k]

            left_tree.update(
                left_greater[j] + 1,
                j,
                dp[j] + j
            )

            right_tree.update(
                j + 1,
                right_greater[j],
                dp[j] - j
            )

        p = q

    return " ".join(map(str, dp))

def run(inp: str) -> str:
    return solve_data(inp).strip()

# Provided samples
assert run("4\n3 1 2 4\n") == "3 6 5 0", "sample 1"
assert run("1\n15\n") == "0", "sample 2"
assert run("5\n3 3 1 5 5\n") == "4 3 6 0 0", "sample 3"

# Minimum-size input
assert run("1\n7\n") == "0", "single building"

# Maximum-size input with all heights equal
n = 100000
inp = f"{n}\n" + " ".join(["42"] * n) + "\n"
expected = " ".join(["0"] * n)
assert run(inp) == expected, "maximum size and all equal"

# Boundary condition: every useful move is to the left
assert run("5\n5 4 3 2 1\n") == "0 1 2 3 4", "decreasing heights"

# Equal-height visibility and off-by-one boundary
assert run("3\n1 3 3\n") == "2 0 0", "equal-height farther building"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 / 7`|`0`| 最小尺寸且无有效过渡 |
 |`100000 / 42 42 ... 42`|`0 0 ... 0`| 最大尺寸和等高配料|
 |`5 / 5 4 3 2 1`|`0 1 2 3 4`| 第一栋建筑的左侧过渡和边界 |
 |`3 / 1 3 3`|`2 0 0`| 相等的高度仍然可见，并且更远的相等最大值不会被错误地阻挡 |

 ## 边缘情况

 对于单个建筑物，输入`1 / 7`给出`0`。 两个最近的更大数组都只包含边界，因此两个线段树都不会收到可以到达建筑物的更新。 其 DP 值保持为零，完全符合要求。 

对于相同的高度，请考虑`3 / 1 3 3`。 两个高度 (3) 的建筑物一起处理并接收`dp=0`。 该组完成后，索引 (2) 处的较远建筑物更新索引 (0) 处的较低建筑物，存储 (0+2=2)。 建筑物 (0) 因此得到答案 (2)。 等高建筑物永远不会相互更新，因为它们的更新会延迟，直到对整个组进行评估为止。 

对于一个所有有用动作都向左移动的序列，`5 / 5 4 3 2 1`，除了第一个位置之外，每个位置最近的严格更大的建筑物位于左侧。 处理最高的建筑物首先给出答案零，然后每个较低的建筑物接收到最高建筑物的距离加上其已计算的延续。 答案变成`0 1 2 3 4`。 

当一侧没有严格意义上更大的建筑物时，间隔边界也很重要。 对于左侧没有更大阻挡物的建筑物，`left_greater`是`-1`，所以它的更新从位置零开始。 当右侧没有更大的阻挡者时，`right_greater`是`n`，因此它的更新延伸到最后一个位置。 此处使用包含端点会错误地允许目标建筑物本身接收自己的更新，这就是实现始终使用半开间隔的原因`[left, right)`。
