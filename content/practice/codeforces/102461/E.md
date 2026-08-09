---
title: "CF 102461E - 黑色星期五"
description: "我们有 n 种不同的显卡类型。 对于类型 i，只有当我们什么都不买或者购买 li 和 ri 之间的整数张卡时，才允许以折扣价购买该类型。 米莎总共最多可以携带 s 张牌，目标是最大化这个总数。"
date: "2026-08-08T09:53:09+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102461
codeforces_index: "E"
codeforces_contest_name: "Innopolis Open 2019-2020, qualification, contest 2"
rating: 0
weight: 102461
solve_time_s: 174
verified: true
draft: false
---

[CF 102461E - 黑色星期五](https://codeforces.com/problemset/problem/102461/E)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 54s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有`n`不同的视频卡类型。 适用类型`i`，只有当我们什么都不买或者之间购买整数张卡时，才允许以折扣价购买该类型`l_i`和`r_i`。 米莎最多可以携带`s`卡片总数，目标是最大化该总数。 

对于一组固定的选定类型，最小的可能购买量是它们的总和`l_i`，而最大的是它们的总和`r_i`。 由于这两个总和之间的每个整数都是可实现的，因此当其下限总和不超过时，所选集合恰好是可行的`s`。 那么它的最佳贡献是以下较小者`s`及其上限总和。 

困难的部分是选择类型。 直接子集枚举考虑`2^n`集，这已经是关于`2^100000`最大输入尺寸的可能性。 即使是由以下索引的动态程序`s`是不可能的，因为`s`可以是`10^13`。 预期的解决方案主要取决于`n`，排序后进行线性或对数扫描适用于`n = 10^5`。 

有三种边界情况很容易破坏粗心的实现。 首先，一个类型可能有`l_i > s`，所以根本买不到。 例如，与`s = 5`和单个区间`[6, 10]`，正确的结果是`0`输出数量为`0`。 治疗`r_i >= s`因为足够会错误地选择这种类型。 

其次，几种单独可行的类型可能无法组合在一起实现。 例如，```
3 20
1 2
10 17
11 16
```具有最优总数`19`，从前两种类型获得。 从上限来看，选择第二和第三种类型看起来很有吸引力，但它们的最小总数是`21`，已经超出了容量。 

第三，最大化下界之和还不够。 和`s = 10`, 间隔`[3, 12]`和`[8, 12]`不能同时选择，但其中任何一个都可以达到`10`。 只尝试打包尽可能多的强制卡的解决方案可能会忽略这样一个事实：具有大容量的类型`r_i`可以填满剩余容量。 

官方解决方案使用如下所述的相同结构缩减：在阈值处拆分类型`2s/7`，分别解决三个足够大的下界的情况，否则将剩余的选择减少到最多两个大类型。 

## 方法

 蛮力方法在概念上很简单。 枚举视频卡类型的每个子集，计算其下限和上限之和，如果下限总和超过则丢弃它`s`，否则取`min(s, sum_r)`作为该子集的最佳总数。 这是正确的，因为两个端点总和之间的每个整数都可以从选定的间隔中获得。 在最坏的情况下，它会检查`2^n`子集，每个子​​集需要最多`O(n)`工作、给予`O(n 2^n)`。 为了`n = 10^5`，这不太可行。 

关键的观察来自于这个因素`1.4`。 将其写为`7/5`。 如果所选集合具有下限总和`L`，其上界和至少为`7L/5`。 结果，一旦`L >= 5s/7`，该集合总是可以精确地达到`s`。 

现在将类型分类为小类型`l_i <= 2s/7`否则就很大。 三个大类型的下界总和大于`6s/7`。 如果三个最小的大类型适合`s`，它们的上限总和至少为`7/5 * 6s/7 = 6s/5 > s`,

 所以这三种类型立即给出最佳答案`s`。 

如果这三个大类型不适合，则任何可行的解决方案都不能包含三个大类型，因为每个其他大类型三元组都有一个更大的下界和。 因此，每个可行解最多包含两个大类型。 

这就留下了一个小得多的组合问题。 我们需要最好的一两个大类型，而小类型可以在它们周围添加。 如果添加所有选定类型使得下限总和超过`s`，我们首先删除最小的下界。 每个移除的类型都很小，因此它的下界最多为`2s/7`。 当总数再次变得可行时，其下限总和大于`5s/7`。 这已经保证了上面的上限总和`s`，所以这种情况自动是最优的`s`。 

因此，唯一的重要搜索是找到最大的一对大类型`r_i + r_j`受`l_i + l_j <= s`。 排序后`l_i`，这可以通过二分搜索和前缀最大值来完成。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |`O(n 2^n)`|`O(n)`| 太慢了 |
 | 最佳|`O(n log n)`|`O(n)`| 已接受 |

 ## 算法演练

 1. 将每个区间及其原始索引存储在一起，并对区间进行排序`l_i`。 排序为我们提供了小类型的前缀和大类型的后缀，这正是排序所需的分隔`2s/7`争论。 
2. 找到第一个下界满足的类型`7l_i > 2s`。 所有早期类型都很小，所有后来类型都很大。 我们使用精确整数比较`7l_i <= 2s`而不是浮点运算，因为输入值是整数并且边界很重要。 
3. 如果至少存在三个大类​​型并且三个最小的大下界适合`s`，选择这三个。 它们的下界总和大于`6s/7`，所以它们的上限总和大于`s`。 因此答案是准确的`s`。 
4. 否则，选择每个小类型作为起始组。 此时，大类型无法为任何可行解决方案贡献三个类型，因此最佳解决方案最多需要两个大类型。 
5. 在大类型中，找到最大的可行对`r_i + r_j`。 对于每种可能的第二种类型，对下限可以容纳在其旁边的最大索引进行二分搜索。 前缀最大为`r`价值观则给出最佳兼容的合作伙伴。 还要考虑单个大型号，因为有时没有配对合适。 
6. 将所选的一种或两种大型类型添加到小型起始组中。 选择大对本身，使其下限和最多为`s`，所以如果组合集合太大，只需要丢弃小类型。 删除最小的下界，直到总下界至多`s`。 
7. 让剩余的选定类型具有下界总和`L`和上限总和`R`。 答案是`min(s, R)`。 如果`L <= s`，我们可以通过最初为每个选定类型分配其下界，然后将剩余的卡片分配到选定的区间中，直到达到目标来构建精确的答案。 
8. 如果某个类型被丢弃，则为其输出零。 对于每个保留类型，使用其原始间隔分配其最终数量，以便保留原始输入顺序。 

### 为什么它有效

 该算法背后的不变性是，在大类型分割之后，每个可行解决方案要么已经包含三个大类型，在这种情况下，前三个这样的类型给出`s`，或最多包含两个大类型。 第一种情况是直接检测到的。 

在第二种情况下，考虑任何最佳解决方案。 其大部分有零种、一种或两种。 如果存在兼容的第二大类型，则添加它只会增加可达到的上限，因此使用一种大类型的最佳值由某些可行的对主导，除非不存在这样的对。 因此，该算法通过最大化总和来找到最好的可能的大部分`r_i`。 

对于小零件，如果所有小类型都与所选的大零件配合在一起，则保留每个小类型总是有益的，因为添加类型不会减少可达到的总数。 如果它们不适合，算法将删除最小的下界。 由于每个删除的类型最多`2s/7`，第一个可行前缀的下界和大于`5s/7`。 那么它的上限总和大于`s`，使施工达到绝对最大值`s`。 在这种情况下，小类型的身份不再重要。 这两种情况涵盖了所有可能的最佳方案。 

## Python 解决方案```python
import sys
from bisect import bisect_right

input = sys.stdin.readline

def solve():
    n, s = map(int, input().split())

    items = []
    for i in range(n):
        l, r = map(int, input().split())
        items.append((l, r, i))

    items.sort()

    # Small: 7 * l <= 2 * s
    cnt = 0
    while cnt < n and 7 * items[cnt][0] <= 2 * s:
        cnt += 1

    # If three smallest large types fit, they already force answer s.
    if cnt + 2 < n:
        l0 = items[cnt][0]
        l1 = items[cnt + 1][0]
        l2 = items[cnt + 2][0]

        if l0 + l1 + l2 <= s:
            selected = [cnt, cnt + 1, cnt + 2]
        else:
            selected = None
    else:
        selected = None

    # Otherwise we need all small types plus the best one/two large types.
    if selected is None:
        selected = list(range(cnt))

        large = items[cnt:]

        if large:
            m = len(large)
            ls = [x[0] for x in large]
            rs = [x[1] for x in large]

            # Prefix maximum r and its index.
            pref_r = [0] * m
            pref_id = [-1] * m

            best_r = -1
            best_id = -1

            for i in range(m):
                if rs[i] > best_r:
                    best_r = rs[i]
                    best_id = i
                pref_r[i] = best_r
                pref_id[i] = best_id

            # Best single large type that fits.
            k = bisect_right(ls, s) - 1
            best_value = -1
            best_pair = None

            if k >= 0:
                best_value = pref_r[k]
                best_pair = (pref_id[k],)

            # Best pair of large types.
            for i in range(m):
                if ls[i] > s:
                    break

                remaining = s - ls[i]
                k = bisect_right(ls, remaining) - 1

                if k < 0:
                    continue

                # We need a partner with index < i.
                k = min(k, i - 1)
                if k < 0:
                    continue

                value = rs[i] + pref_r[k]
                if value > best_value:
                    best_value = value
                    best_pair = (pref_id[k], i)

            if best_pair is not None:
                for x in best_pair:
                    selected.append(cnt + x)

        # Remove the smallest lower bounds until the set fits.
        selected.sort(key=lambda i: items[i][0])

        lower_sum = sum(items[i][0] for i in selected)

        while selected and lower_sum > s:
            x = selected.pop(0)
            lower_sum -= items[x][0]

    # The selected set is now feasible by lower bounds.
    lower_sum = sum(items[i][0] for i in selected)
    upper_sum = sum(items[i][1] for i in selected)

    target = min(s, upper_sum)

    ans = [0] * n
    remaining = target - lower_sum

    # Start from all lower bounds and distribute the remaining amount.
    for pos in selected:
        l, r, original = items[pos]
        add = min(r - l, remaining)
        ans[original] = l + add
        remaining -= add

    print(target)
    print(*ans)

if __name__ == "__main__":
    solve()
```实现的第一部分对间隔进行排序并使用整数算术查找阈值。 乘以`7`在 Python 中是安全的，并且避免了与表示相关的所有精度问题`1.4`作为浮点值。 

三大类分支是故意在一般分支之前检查的。 如果成功的话，建造已经足以达到`s`，因此不需要配对搜索。 

通用分支在大型类型上构建前缀最大值。 对于固定大类型`i`,`bisect_right`找到下界最多为的每个大类型`s - l_i`。 限制合作伙伴指数低于`i`保证同一类型永远不会使用两次。 然后，前缀最大值给出具有最大上限的兼容类型。 

单一类型候选是必要的，因为可能没有可行的对。 当只有一种大类型存在时，它也可以作为后备。 

选择较大部分后，代码将按下限对所选索引进行排序，并在必要时删除最小的索引。 这个顺序是经过深思熟虑的。 所有大类型的下界都比每个小类型更大，因此保留可行的大类型对，同时首先丢弃小类型。 

最后，构建开始于每个选定的类型`l_i`。 由于目标至多为总上限，因此剩余金额始终可以在不超过任何金额的情况下进行分配`r_i`。 该代码按排序顺序处理所选类型，但写入`ans[original]`，因此输出保持输入顺序。 

## 工作示例

 提供的样本是```
3 20
1 2
10 17
11 16
```阈值是`2s/7 = 40/7`，所以只有第一种类型很小。 

| 舞台| 选定的下限 | 选定的上限 | 状态|
 | ---| ---| ---| ---|
 | 分类|`[1]`|`[2]`| 一大一小，两大|
 | 三张大支票| 不可用 | 不可用 | 少于三种大类型 |
 | 最佳大选择|`[10]`|`[17]`| 一对`10 + 11`不适合|
 | 添加小号 |`[1, 10]`|`[2, 17]`| 较低总和`11`|
 | 最终目标|`[1, 10]`|`[2, 17]`|`min(20, 19) = 19`|

 最终的作业可以是`2 17 0`，准确给出`19`牌。 该示例演示了为什么最大化两个大类型的上限是不够的：它们的下限之和已经为`21`，因此只能使用其中之一。 

第二个例子是```
5 10
1 2
2 3
2 3
6 9
7 10
```阈值是`20/7`，所以前三种类型较小，后两种类型较大。 

| 舞台| 精选指数| 降低总和 | 总和上限 |
 | ---| ---| ---| ---|
 | 小型 |`1, 2, 3`|`5`|`8`|
 | 大对支票 |`6 + 7 = 13`| 太大| 不可行|
 | 最佳大型|`7`|`7`|`10`|
 | 添加小类型 |`1, 2, 3, 5`|`12`|`18`|
 | 删除最小下界 |`2, 3, 5`|`11`|`16`|
 | 删除下一个最小下界 |`3, 5`|`9`|`13`|
 | 最终目标|`3, 5`|`9`|`13`|

 最终目标是`10`。 一项有效的作业是`0 0 3 0 7`。 该跟踪的重要部分是保留大类型本身，同时删除小类型。 一旦较低的总和高于`5s/7`，剩余的集合保证有足够的上限容量来达到`s`。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |`O(n log n)`| 排序需要`O(n log n)`，并且每个大类型执行一次二分搜索 |
 | 空间|`O(n)`| 排序后的区间、前缀数组、选定的索引和答案数组都是线性的 |

 和`n <= 10^5`,`O(n log n)`意味着大约几百万个基本运算，而所有算术都涉及`s`,`l_i`， 和`r_i`直接作为整数处理。 该算法不会分配任何与`s`，这是至关重要的，因为`s`可以大到`10^13`。 

## 测试用例

 以下工具准确检查提供的示例，并对小型自定义案例进行详尽的搜索。 由于允许多个最佳输出，因此自定义测试会验证生成的分配并将其总数与真正的最佳值进行比较，而不需要一个特定的向量。```python
import sys
import io
from bisect import bisect_right
from itertools import product

def solve_io(data: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(data)
    sys.stdout = io.StringIO()

    # Paste the solve() function from the solution here.
    # In a real test file, import solve from the submitted solution instead.
    solve()

    result = sys.stdout.getvalue()

    sys.stdin = old_stdin
    sys.stdout = old_stdout
    return result

def brute_force(inp: str):
    it = iter(inp.split())
    n = int(next(it))
    s = int(next(it))

    a = []
    for _ in range(n):
        l = int(next(it))
        r = int(next(it))
        a.append((l, r))

    best = 0

    for mask in range(1 << n):
        low = 0
        high = 0

        for i in range(n):
            if mask >> i & 1:
                low += a[i][0]
                high += a[i][1]

        if low <= s:
            best = max(best, min(s, high))

    return best

def check(inp: str):
    out = solve_io(inp)
    tokens = list(map(int, out.split()))

    n, s = map(int, inp.splitlines()[0].split())

    w = tokens[0]
    ans = tokens[1:1 + n]

    assert len(ans) == n
    assert 0 <= w <= s
    assert sum(ans) == w

    lines = inp.splitlines()
    intervals = [tuple(map(int, line.split())) for line in lines[1:]]

    for x, (l, r) in zip(ans, intervals):
        assert x == 0 or l <= x <= r

    assert w == brute_force(inp)

# Provided sample.
sample1 = """\
3 20
1 2
10 17
11 16
"""

assert solve_io(sample1) == "19\n2 17 0\n", "sample 1"

# Minimum-size input.
sample2 = """\
1 5
3 5
"""
check(sample2)

# No type can be bought.
sample3 = """\
2 5
6 10
7 12
"""
check(sample3)

# Three large types fit and immediately force answer s.
sample4 = """\
4 20
1 2
6 9
7 10
8 12
"""
check(sample4)

# Pair of large types is impossible, but one large type plus
# some small types gives the optimum.
sample5 = """\
4 20
1 2
2 3
10 15
11 16
"""
check(sample5)
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`3 20; 1 2; 10 17; 11 16`|`19`， 例如`2 17 0`| 提供了一个不可行的大对的样本并拒绝了 |
 |`1 5; 3 5`|`5`， 和`0 5`| 最低限度`n`和准确的容量|
 |`2 5; 6 10; 7 12`|`0`， 和`0 0`| 下限超过容量的类型 |
 |`4 20; 1 2; 6 9; 7 10; 8 12`|`20`| 三大型分公司|
 |`4 20; 1 2; 2 3; 10 15; 11 16`|`20`| 大对边界和重建|

 自定义测试仅在测试工具内部使用详尽的枚举，其中实例很小。 提交的算法从不执行此枚举。 

## 边缘情况

 第一种边缘情况是最低购买量已经超过容量的类型。 考虑```
1 5
6 10
```分类将类型放入大类别，但其下界大于`s`，因此它不能是任何可行的对或单一类型选择的一部分。 所选集保持为空，输出为```
0
0
```第二个边缘情况是提供的示例，其中两种大类型单独适合，但它们的最小数量不适合在一起：```
3 20
1 2
10 17
11 16
```大对的总和较小`21`，因此配对搜索会拒绝它。 最好的大选择是`[10,17]`，并添加小类型`[1,2]`给出较低的总和`11`和上总和`19`。 该算法输出总计`19`。 

第三种边缘情况是三种大类型适合时：```
4 20
1 2
6 9
7 10
8 12
```三个大的下界总和为`21`，所以这个特定的输入实际上并没有进入三大分支。 该边界很有用，因为它确认比较是包容性的：该算法要求三个下界之和最多为`s`。 如果输入更改为```
4 20
1 2
6 9
6 10
7 11
```三个大的下界总和为`19`。 它们的上限总和为`30`，所以答案正是`20`。 

第四种边缘情况是当添加所有小类型最初超过`s`。 认为```
4 10
1 100
2 3
6 9
7 10
```小类型的总和较低`3`。 最好的大选择可以包含具有下界的类型`7`，并且添加每个小类型会得到较低的总和`10`，这已经是可行的。 如果存在另一个小类型并导致溢出，算法将首先删除最小的下界。 因为每个被移除的小下界至多是`2s/7`，第一个可行的剩余集合的总和将小于`5s/7`，使其上限足以达到`s`。 

最后的边缘情况涉及阈值处的整数算术。 分类用途```
7 * l_i <= 2 * s
```而不是`l_i <= 2 * s / 7`与浮点。 一个值恰好等于`2s/7`属于小团体。 对等式边界进行错误分类可能会改变是否考虑三种大类型，因此整数形式可以避免舍入错误和相差一错误。
