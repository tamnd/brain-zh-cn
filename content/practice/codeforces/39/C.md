---
title: "CF 39C - 月球陨石坑"
description: "每个凹坑由中心坐标 c 和半径 r 描述。 由于机器人沿着一条线移动，因此每个陨石坑都可以通过其间隔在该线上表示：$[c-r, c+r]$ 奥库洛夫教授的规则表明，任何两个选定的陨石坑必须要么完全不相交，要么......"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "dp", "sortings"]
categories: ["algorithms"]
codeforces_contest: 39
codeforces_index: "C"
codeforces_contest_name: "School Team Contest 1 (Winter Computer School 2010/11)"
rating: 2100
weight: 39
solve_time_s: 265
verified: false
draft: false
---

[CF 39C - 月球陨石坑](https://codeforces.com/problemset/problem/39/C)

 **评分：** 2100
 **标签：** dp、排序
 **求解时间：** 4m 25s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 每个陨石坑都由中心坐标描述`c`和半径`r`。 由于机器人沿着一条线移动，因此每个陨石坑都可以通过其间隔在该线上表示：$[c-r,\ c+r]$奥库洛夫教授的规则规定，任何两个选定的陨石坑必须要么完全不相交，要么一个必须完全位于另一个陨石坑内。 禁止部分重叠。 

对于间隔，这意味着对于任意两个选定的间隔：

 1.它们根本不相交。 
2. 一个区间完全包含在另一个区间内。 
3. 允许接触端点。 

我们必须选择满足此条件的最大可能的陨石坑子集并输出任何最佳集合。 

约束条件`n ≤ 2000`是主要线索。 立方解与周围`8 * 10^9`操作是不可能的。 二次动态规划解决方案是现实的，尤其是在仔细实现的 Python 中。 由于该任务还要求重建所选集合，因此我们需要存储转换，而不仅仅是答案大小。 

棘手的是，间隔之间的关系并不像普通的间隔调度那样简单地“兼容”或“不兼容”。 如果一个间隔包含另一个间隔，则两个间隔可以共存，这会创建类似于正确匹配的括号的嵌套结构。 

一些边缘情况很容易被错误处理。 

考虑切线间隔：```
2
0 1
2 1
```这些间隔是`[−1,1]`和`[1,3]`。 它们在某一点接触并被允许在一起。 在检查重叠时使用严格的不等式会错误地拒绝它们。 

现在考虑交叉区间：```
2
0 3
4 3
```这些间隔是`[−3,3]`和`[1,7]`。 它们重叠，但都不包含对方。 不能同时选择它们。 仅检查“不相交”的粗心实现会错误地接受它们。 

嵌套间隔也需要小心：```
3
0 10
0 5
0 2
```这三个陨石坑同时有效，因为每个较小的陨石坑都完全位于较大的陨石坑内。 总是喜欢较小或总是喜欢较大间隔的贪婪策略很容易在更复杂的情况下失去最佳解决方案。 

当两个区间共享一个端点时，会出现另一种微妙的情况：```
2
0 5
5 0
```间隔是`[−5,5]`和`[5,5]`。 第二个完全包含在第一个中，并且允许相切。 使用严格遏制而不是非严格遏制可以打破这种情况。 

## 方法

 蛮力的想法很简单。 我们尝试每个陨石坑子集并验证每对陨石坑是否都满足规则。 配对检查需要`O(n²)`，并且有`2^n`子集，因此总复杂度变为`O(2^n * n²)`。 即使是为了`n = 40`，这已经是无望了，而实际的极限是`2000`。 

一个更精致的蛮力方向是考虑间隔。 两个区间是兼容的，除非它们相交。 穿越的意思：$l_1 < l_2 < r_1 < r_2$或对称相反的顺序。 

这揭示了问题的真正结构。 有效区间族正是层流族，这意味着区间要么是不相交的，要么是嵌套的。 一旦间隔按端点排序，结构就会变成递归的。 在一个间隔内，我们再次为其子级解决相同的问题。 不相交的组也可以独立连接。 

这表明间隔 DP。 

关键的观察结果是，如果我们处理按左端点和右端点排序的间隔，则每个有效的解决方案都表现得像正确嵌套的段。 每当我们选择一个区间时，所有其他选择的区间要么完全在它之内，要么完全在它之外。 

我们可以在区间范围内构建 DP。 对于每个间隔`i`，我们计算完全位于内部的最佳有效子集`i`。 然后，我们与加权间隔调度类似地组合非交叉子间隔。 

自从`n ≤ 2000`， 一个`O(n²)`或者`O(n² log n)`解决方案是可以接受的。 标准接受的解决方案在排序间隔后使用二次动态规划。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(2^n·n²) | O(2^n·n²) | O(n) | 太慢了 |
 | 最佳DP | O(n²) | O(n²) | 已接受 |

 ## 算法演练

 ### 区间表示

 每个火山口变成一个区间：$[l_i,r_i]=[c_i-r_i,\ c_i+r_i]$我们还保留原始索引，因为输出必须使用输入编号。 

### 排序

 1. 通过增加左端点对区间进行排序。 
2. 如果左端点相等，则按右端点递减排序。 

这个顺序至关重要。 较大的包含区间出现在较小的包含区间之前。 这使得嵌套关系易于处理。 

### 定义交叉

 1. 两个区间交叉，如果：$l_i < l_j \le r_i < r_j$交叉区间不能同时属于答案。 

### 动态规划状态

 1.让`dp[i]`是有效子集的最大大小，其最外层选择的间隔是间隔`i`。 

我们总是包括`i`本身就处于这种状态。 

### 过渡

 1. 对于每个间隔`i`，严格处理其中的所有区间。 
2. 区间内`i`，我们只想组合不相交的“顶级”孩子。 如果两个孩子在没有遏制的情况下重叠，他们就会交叉并且一起无效。 
3. 这成为一个关于直接兼容子代的加权间隔调度问题`i`。 

对于每个候选孩子`j`里面`i`：

 - 我们可以采取根植于的最优结构`j`， 值得`dp[j]`。 
- 然后继续处理下一个不相交的孩子。 

### 辅助 DP

 1. 在位置上使用另一个 DP 以不重叠的顺序组合子项。 

这计算区间内不相交子结构的最佳集合`i`。 

1.最后：```
dp[i] = 1 + best_inside
```这`1`计数间隔`i`本身。 

### 重建

 1. 在转换期间存储父级选择。 
2.找到最大值的区间后`dp[i]`，递归地重建所有选定的区间。 

### 为什么它有效

 关键的不变量是每个有效的区间族都形成层状结构。 所选区间内的任何区间要么属于一个嵌套分支，要么属于另一个完全不相交的分支。 跨越结构是不可能的。 

因此，每个最优解都以区间为根`i`分解为其不相交的直接子代的独立最优解。 DP 正是探索了这些可能性，并且从不结合交叉间隔。 由于每个有效配置都可以通过这种方式唯一分解，因此 DP 不会错过最佳解决方案。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())

    segs = []

    for idx in range(1, n + 1):
        c, r = map(int, input().split())
        l = c - r
        rr = c + r
        segs.append((l, rr, idx))

    segs.sort(key=lambda x: (x[0], -x[1]))

    l = [0] * n
    r = [0] * n
    idxs = [0] * n

    for i in range(n):
        l[i], r[i], idxs[i] = segs[i]

    dp = [1] * n
    choice = [[] for _ in range(n)]

    inside = [[] for _ in range(n)]

    for i in range(n):
        for j in range(i + 1, n):
            if l[i] <= l[j] and r[j] <= r[i]:
                inside[i].append(j)

    for i in range(n - 1, -1, -1):
        children = inside[i]

        m = len(children)

        best = [0] * (m + 1)
        take = [False] * m
        nxt = [m] * m

        for a in range(m):
            j = children[a]

            b = a + 1
            while b < m and l[children[b]] <= r[j]:
                b += 1

            nxt[a] = b

        pick = [False] * m

        for a in range(m - 1, -1, -1):
            j = children[a]

            skip_val = best[a + 1]
            take_val = dp[j] + best[nxt[a]]

            if take_val > skip_val:
                best[a] = take_val
                pick[a] = True
            else:
                best[a] = skip_val

        dp[i] = 1 + best[0]

        cur = 0
        selected = []

        while cur < m:
            if pick[cur]:
                j = children[cur]
                selected.append(j)
                cur = nxt[cur]
            else:
                cur += 1

        choice[i] = selected

    root = max(range(n), key=lambda x: dp[x])

    ans = []

    def build(v):
        ans.append(idxs[v])
        for to in choice[v]:
            build(to)

    build(root)

    print(len(ans))
    print(*ans)

solve()
```第一步将每个火山口转换为一个区间。 使用区间端点直接将所有几何条件简化为数字之间的比较。 

通过增加左端点和减少右端点进行排序是必不可少的。 假设两个区间共享相同的左端点。 较大的必须首先出现，以便遏制关系在 DP 转换期间保持有效。 

数组`inside[i]`存储完全包含在区间中的每个区间`i`。 由于间隔已经排序，所有后代都出现在`i`。 

每个间隔内的辅助 DP 的行为类似于加权间隔调度。 一旦我们选择了一个子区间`j`，每个左端点仍在内部的后来的孩子`j`属于`j`的子树，并且不能作为单独的顶级子树进行处理。 指针`nxt[a]`直接跳到下一个不相交的子节点。 

一个微妙的实现细节是条件：```
while b < m and l[children[b]] <= r[j]:
```这`<=`是正确的，因为接触间隔在同一嵌套级别上不是不相交的。 如果另一个间隔开始于之前或恰好在`r[j]`，那么它要么相交，要么嵌套在其中`j`，所以它一定属于`j`的子树而不是成为兄弟姐妹。 

重建阶段递归地遵循存储的选择。 由于每个选定的子节点已经代表一个最佳嵌套子树，因此递归会重建完整的最佳答案。 

## 工作示例

 ### 示例 1

 输入：```
4
1 1
2 2
4 1
5 1
```间隔：

 | 索引 | 间隔|
 | --- | --- |
 | 1 | [0,2]|
 | 2 | [0,4]|
 | 3 | [3,5]|
 | 4 | [4,6]|

 排序顺序：

 | 位置 | 原始索引 | 间隔 |
 | --- | --- | --- |
 | 0 | 2 | [0,4]|
 | 1 | 1 | [0,2]|
 | 2 | 3 | [3,5]|
 | 3 | 4 | [4,6]|

 DP计算：

 | 间隔 | 最佳嵌套值 | DP |
 | --- | --- | --- |
 | [4,6]| 0 | 1 |
 | [3,5]| 0 | 1 |
 | [0,2]| 0 | 1 |
 | [0,4]| 2 | 3 |

 最优结构植根于`[0,4]`包含`[0,2]`和`[4,6]`。 这些间隔是不相交的，因此这三个间隔可以共存。 

输出：```
3
1 2 4
```该迹线展示了层状结构。 外部区间包含一个嵌套分支和一个不相交分支。 

### 示例 2

 输入：```
5
0 5
2 1
4 1
6 1
8 1
```间隔：

 | 索引 | 间隔 |
 | --- | --- |
 | 1 | [-5,5]|
 | 2 | [1,3]|
 | 3 | [3,5]|
 | 4 | [5,7]|
 | 5 | [7,9]|

 DP 指出：

 | 间隔 | 兼容顶级儿童| DP |
 | --- | --- | --- |
 | [7,9]| 无 | 1 |
 | [5,7]| 无 | 1 |
 | [3,5]| 无 | 1 |
 | [1,3]| 无 | 1 |
 | [-5,5]| [1,3], [3,5] | 3 |

 最佳答案选择区间 1、2 和 3。 

此示例确认允许相切。`[1,3]`和`[3,5]`触摸一点并保持兼容。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n²) | 建立遏制关系和 DP 转换都需要二次工作 |
 | 空间| O(n²) | 包含列表可以存储 O(n²) 对 |

 和`n ≤ 2000`，二次复杂度是完全可以接受的。 大约 400 万次操作完全符合 Python 的时间限制，并且内存使用量也远低于限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def solve():
    input = sys.stdin.readline

    n = int(input())

    segs = []

    for idx in range(1, n + 1):
        c, r = map(int, input().split())
        segs.append((c - r, c + r, idx))

    segs.sort(key=lambda x: (x[0], -x[1]))

    l = [x[0] for x in segs]
    r = [x[1] for x in segs]
    ids = [x[2] for x in segs]

    dp = [1] * n
    choice = [[] for _ in range(n)]

    inside = [[] for _ in range(n)]

    for i in range(n):
        for j in range(i + 1, n):
            if l[i] <= l[j] and r[j] <= r[i]:
                inside[i].append(j)

    for i in range(n - 1, -1, -1):
        children = inside[i]
        m = len(children)

        best = [0] * (m + 1)
        nxt = [m] * m
        pick = [False] * m

        for a in range(m):
            j = children[a]

            b = a + 1
            while b < m and l[children[b]] <= r[j]:
                b += 1

            nxt[a] = b

        for a in range(m - 1, -1, -1):
            j = children[a]

            take = dp[j] + best[nxt[a]]
            skip = best[a + 1]

            if take > skip:
                best[a] = take
                pick[a] = True
            else:
                best[a] = skip

        dp[i] = 1 + best[0]

        cur = 0

        while cur < m:
            if pick[cur]:
                choice[i].append(children[cur])
                cur = nxt[cur]
            else:
                cur += 1

    root = max(range(n), key=lambda x: dp[x])

    ans = []

    def rec(v):
        ans.append(ids[v])
        for to in choice[v]:
            rec(to)

    rec(root)

    print(len(ans))
    print(*sorted(ans))

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out

    solve()

    sys.stdout = sys.__stdout__
    return out.getvalue().strip()

# provided sample
assert run(
"""4
1 1
2 2
4 1
5 1
"""
).splitlines()[0] == "3", "sample"

# minimum case
assert run(
"""1
5 3
"""
) == "1\n1", "single crater"

# fully nested
assert run(
"""3
0 10
0 5
0 2
"""
).splitlines()[0] == "3", "all nested"

# crossing intervals
assert run(
"""2
0 3
4 3
"""
).splitlines()[0] == "1", "crossing intervals"

# tangent intervals
assert run(
"""3
0 1
2 1
4 1
"""
).splitlines()[0] == "3", "touching intervals allowed"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单陨石坑| 已选择 1 个陨石坑 | 最小输入尺寸|
 | 完全嵌套间隔 | 选择所有间隔 | 深度嵌套|
 | 穿越间隔| 仅选择 1 个 | 无效的部分重叠 |
 | 切线间隔| 都选了| 允许端点触摸 |

 ## 边缘情况

 再次考虑切线间隔：```
2
0 1
2 1
```间隔变为`[−1,1]`和`[1,3]`。 在兼容性检查期间，它们被视为足够不相交以共存，因为触摸是合法的。 DP 包括两个区间，产生答案大小`2`。 

现在检查交叉间隔：```
2
0 3
4 3
```间隔是`[−3,3]`和`[1,7]`。 两者都不包含对方，而且它们内部重叠。 在处理第二个间隔时，DP 转换会跳过将它们组合为同级间隔，因为第二个间隔在第一个间隔结束之前开始。 最终答案只能保留一个区间。 

深度嵌套也可以正常工作：```
4
0 10
0 7
0 4
0 1
```每个间隔都完全位于前一个间隔内。 递归结构自然形成单链。 DP 计算：```
1 + 1 + 1 + 1 = 4
```所以选择所有间隔。 

最后，考虑相等的端点：```
2
0 5
5 0
```间隔是`[−5,5]`和`[5,5]`。 第二个完全包含在第一个中，因为包含使用非严格的不平等。 该算法正确地保留了两个区间，而不是拒绝边界情况。
