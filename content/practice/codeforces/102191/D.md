---
title: "CF 102191D - 图片日"
description: "我们有偶数的学生，分成固定的朋友对。 每对必须占据两个连续的位置，但我们可以选择哪个朋友排在第一位。"
date: "2026-08-18T19:39:43+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102191
codeforces_index: "D"
codeforces_contest_name: "PSUT Coding Marathon 2019"
rating: 0
weight: 102191
solve_time_s: 325
verified: false
draft: false
---

[CF 102191D - 图片日](https://codeforces.com/problemset/problem/102191/D)

 **评级：** -
 **标签：** -
 **求解时间：** 5m 25s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有偶数的学生，分成固定的朋友对。 每对必须占据两个连续的位置，但我们可以选择哪个朋友排在第一位。 任务是对这些对进行排序并确定每个对的方向，以便完整的高度数组首先永远不会减少，并且在某个峰值之后永远不会增加。 输出可以是任何有效的排列，或者`-1`如果不存在这样的安排。 这与官方问题陈述的结构相符。 

对于每一对，忘记其原始顺序并将其写为区间`[l, r]`， 在哪里`l`是较短的高度并且`r`是较高的高度。 如果该对出现在图片的递增一侧，则必须写为`l, r`。 如果它出现在递减的一侧，则必须写为`r, l`。 

考虑连续放置在增加一侧的两对。 如果它们的间隔是`[l1, r1]`和`[l2, r2]`，他们的四个高度变成`l1, r1, l2, r2`。 为了使其不减，我们需要`r1 <= l2`。 换句话说，尽管允许在端点处触摸，但两个间隔不能重叠。 同样的论点也适用于递减一侧的对，只不过它们的顺序相反。 

这给出了中央的重新表述。 我们必须将所有对间隔分为两组，其中同一组中的间隔是成对不重叠的。 一组将形成增加的一半，另一组将形成减少的一半。 

界限`n <= 3 * 10^5`意味着最多可以有`150000`对。 二次算法已经大致执行`2.25 * 10^10`最坏情况下的配对比较，远远超出了两秒的限制所能处理的范围。 我们需要一个`O(n log n)`解决方案，其中对数因子来自排序。 

有几种边缘情况可能会欺骗使用严格不等式的实现。 首先，触摸间隔是兼容的。 例如，```
4
1 2
2 3
```有有效的安排`1 2 2 3`。 两个区间`[1,2]`和`[2,3]`高处触摸`2`，并且允许相邻高度相等。 一个实现使用`l > previous_r`而不是`l >= previous_r`会错误地拒绝此案。 

第二种情况是峰值位于一对内部。 例如，```
4
1 4
2 3
```可以安排为`2 3 4 1`。 第一对位于递增侧，而第二对是包含峰值的对，并按降序写入。 间隔`[1,4]`和`[2,3]`重叠，因此将整个问题视为要求每个区间不相交会错误地拒绝它。 

第三种情况是三个间隔在同一高度重叠：```
6
1 5
2 4
3 6
```这个没有办法解决。 在高处`3`，所有三对间隔均处于活动状态。 由于山只有两侧，因此其中两对必须属于同一侧，但重叠间隔不能共存于单调一侧。 

最后，相等的高度是完全有效的。 例如，```
4
3 3
3 3
```可以简单地产生`3 3 3 3`。 解决方案必须处理一个区间`[x,x]`就像其他间隔一样，并且必须允许将多个这样的间隔分配给不同的一侧。 

## 方法

 最直接的方法是将每一对视为不可分割的块，尝试块的每种排序，尝试每个块的两个方向，并检查所得的高度数组是否是一座山。 和`m = n/2`对，有`m!`排序对的方法和`2^m`引导他们的方法。 每个候选人都需要`O(n)`工作来检查，所以总工作是`O(n * m! * 2^m)`。 对于最大输入，这是`3 * 10^5 * 150000! * 2^150000`，这是遥不可及的。 

蛮力之所以有效，是因为它明确地探索了每一种可能的放置和方向。 问题是几乎所有这些选择都是不必要的。 事实上，每对都恰好有两个元素，这给了我们一个更强大的结构。 

对每对中的两个高度进行排序，并将这对视为一个区间`[l,r]`。 在增加的一侧，该对必须表现为`l,r`。 当第一个间隔在第二个间隔之前或开始时结束时，两个连续的递增对恰好有效。 因此，增加的边是一串不重叠的区间。 颠倒顺序后，减少的一侧具有相同的性质。 

因此，我们将问题简化为将间隔划分为两条不重叠的间隔链。 这是关键的观察结果，因为间隔调度具有简单的贪婪结构。 

按左端点对所有间隔进行排序。 维护两条链中当前占用的最右端点。 对于新的间隔`[l,r]`，它可以精确地附加到链上`l >= end[chain]`。 如果两个链都不可用，则当前间隔与已经占据两个链的间隔重叠，因此三个间隔在公共点重叠并且不存在解。 

一旦获得两条链，仍然存在一个微妙的问题。 我们需要在峰值处将递增链与递减链连接起来。 我们通过强制具有全局最大右端点的区间属于递减链来解决这个问题。 然后，当按递减右端点排序时，递减侧的第一个区间的端点至少与递增侧的最后一个区间一样大。 这使得跨越峰值的转变有效。 

如果贪婪着色将全局最大间隔放在第一个链中，则只需交换两个链标签即可。 交换颜色保留了每个链仅包含不重叠间隔的属性。 

比较结果为：

 | 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |`O(n * (n/2)! * 2^(n/2))`|`O(n)`| 太慢了 |
 | 最佳 |`O(n log n)`|`O(n)`| 已接受 |

 ## 算法演练

 1. 转换每对好友`(a,b)`进入一个区间`[l,r]`， 在哪里`l = min(a,b)`和`r = max(a,b)`。 保留原始对索引，以便我们稍后可以重建它的两个高度。 与单调端内的兼容性相关的唯一信息是较小和较大的端点。 
2. 找到右端点对`r`是全局最大值。 该货币对最终将被放置在下降的一侧。 选择全局最大值很有用，因为它会自动主导峰值处增加侧的最后一个间隔。 
3. 按左端点对所有间隔进行排序。 维持`end[0]`和`end[1]`，当前分配给两个链的最后一个间隔的最右端点。 最初两个链都是空的。 
4. 从左到右处理排序后的区间。 如果当前左端点`l`满足`l >= end[0]`，将区间分配给链`0`。 否则，如果`l >= end[1]`，将其分配给链`1`。 如果两个条件都不成立，则报告`-1`。 

贪心赋值是有效的，因为间隔是通过增加左端点来处理的。 当两个链都被阻塞时，当前间隔与每个链中的一个间隔重叠，因此三个间隔在当前左端点重叠。 不能存在划分为两个不重叠的链的情况。 
5. 所有区间分配完成后，查看全局最大右端点区间的颜色。 如果是连锁的话`0`，交换每个区间的两个链标签。 这仅改变了一条链代表山的哪一侧，而不改变每条链内的间隔是不相交的事实。 
6.排序链`0`通过增加左端点并将每对附加为`(l,r)`。 由于该链中的连续间隔满足`previous_r <= current_l`，该链产生的完整序列是非递减的。 
7.排序链`1`通过减少右端点并将每对附加为`(r,l)`。 由于间隔不重叠，因此它们的左端点也按相反方向适当排序，因此该序列是非递增的。 
8. 连接递增链和递减链。 递增链的最后一个值是其最终区间的最大端点。 递减链的第一个值是链中所有区间中最大的端点`1`。 由于全球最大的右端点被故意放入链中`1`，减少侧的第一个值至少是增加侧的最后一个值。 这样整个阵就具有了所需要的山形。 

### 为什么它有效

 贪婪分配期间的不变性是，已构造的每个链都是不重叠间隔的有效序列。 当将新间隔分配给链时，其左端点至少是该链的最后一个右端点，因此不变式保持为真。 如果两个链都拒绝某个区间，则每个链中都有一个区间，其右端点至少是当前左端点。 与当前区间一起，三个区间在该点重叠，因此不能存在两链分区。 

分区后，递增链中的每个区间从小到大写入，递减链中每个区间从小到小写入。 每个链内的顺序保证了单调性。 全局最大的右端点位于递减链中，因此该链的第一个值至少是递增链中的每个右端点。 这证明巅峰时期的转变也是有效的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())
    m = n // 2

    intervals = []
    global_max_idx = -1
    global_max_r = -1

    for i in range(m):
        a, b = map(int, input().split())
        l = min(a, b)
        r = max(a, b)
        intervals.append((l, r, i))

        if r > global_max_r:
            global_max_r = r
            global_max_idx = i

    intervals.sort()

    # end[c] is the right endpoint of the last interval
    # assigned to chain c.
    end = [-1, -1]
    color = [-1] * m

    for l, r, idx in intervals:
        if l >= end[0]:
            color[idx] = 0
            end[0] = r
        elif l >= end[1]:
            color[idx] = 1
            end[1] = r
        else:
            print(-1)
            return

    # The globally largest right endpoint must be on the
    # decreasing side. If it is currently on chain 0,
    # swap the two chain labels.
    if color[global_max_idx] == 0:
        for i in range(m):
            color[i] ^= 1

    left = []
    right = []

    for l, r, idx in intervals:
        if color[idx] == 0:
            left.append((l, r, idx))
        else:
            right.append((l, r, idx))

    left.sort(key=lambda x: (x[0], x[1]))
    right.sort(key=lambda x: (-x[1], -x[0]))

    ans = []

    for l, r, idx in left:
        ans.append(l)
        ans.append(r)

    for l, r, idx in right:
        ans.append(r)
        ans.append(l)

    print(*ans)

if __name__ == "__main__":
    solve()
```输入循环首先将每对标准化为`(l,r)`。 保留原始索引是因为两个链分配是使用归一化区间进行的，而最终输出只需要两个原始高度。 由于该对可以按任意顺序打印，因此存储`l`和`r`就足够了。 

间隔按以下顺序排序`l`。 两人`end`值表示每个链中当前的最后一个间隔。 比较的是`l >= end[c]`， 不是`l > end[c]`，因为相邻高度相等是合法的。 初始值`-1`有效，因为每个高度至少是`1`。 

当两个链都不接受间隔时，就没有可能的解决方案，因此算法可以立即终止。 无需回溯。 

全局最大右端点被强制上链`1`。 如果它被分配到链`0`，翻转每种颜色就足够了。 这比修改贪婪过程以在扫描期间强制特定间隔更简单。 

左链按递增排序`l`。 因为贪婪不变量保证每个间隔的开始时间不早于前一个间隔的结束时间，所以将每对写为`l,r`创建一个非递减序列。 右链按降序排序`r`每对写为`r,l`，产生一个非递增序列。 

Python 整数具有任意精度，因此高度范围`10^9`不需要特殊的整数类型。 主要的实现问题是内存：算法存储`O(n)`元组和最终答案，它完全符合 256 MB 的限制`n <= 3 * 10^5`。 

## 工作示例

 第一个跟踪使用提供的样本。```
8
1 3
4 2
6 7
5 7
```标准化后，间隔为`[1,3]`,`[2,4]`,`[6,7]`， 和`[5,7]`。 它们已经接近排序顺序，因此贪婪过程很容易遵循。 

| 间隔 | 当前结束[0] | 当前结束[1] | 选择链条|
 | --- | --- | --- | --- |
 |`[1,3]`|`-1`|`-1`|`0`|
 |`[2,4]`|`3`|`-1`|`1`|
 |`[5,7]`|`3`|`4`|`0`|
 |`[6,7]`|`7`|`4`|`1`|

 全局最大右端点为`7`，并且具有该端点的区间之一已经在链中`1`。 我们可以保持颜色不变。 链`0`给出`1 3 5 7`, 同时链`1`，按右端点递减排序，给出`7 6 4 2`。 最终的顺序是```
1 3 5 7 7 6 4 2
```它与示例输出不同，这是允许的，因为问题接受任何有效的排列。 它先增加然后减少，并且每个原始对都保持相邻。 

对于第二条跟踪，请考虑以下有效输入：```
6
1 2
2 4
3 5
```间隔是`[1,2]`,`[2,4]`， 和`[3,5]`。 

| 间隔 | 当前结束[0] | 当前结束[1] | 选择链条|
 | --- | --- | --- | --- |
 |`[1,2]`|`-1`|`-1`|`0`|
 |`[2,4]`|`2`|`-1`|`0`|
 |`[3,5]`|`4`|`-1`|`1`|

 间隔`[3,5]`无法加入链`0`因为`3 < 4`，所以它进入链`1`。 全局最大右端点为`5`，已经上链`1`。 

链`0`产生`1 2 2 4`。 链`1`产生`5 3`。 最终结果是```
1 2 2 4 5 3
```序列增加通过`1,2,2,4,5`然后减少到`3`。 此跟踪还说明了为什么触摸间隔是兼容的：`[1,2]`和`[2,4]`可以共享链`0`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |`O(n log n)`| 有`n/2`间隔，排序在线性扫描中占主导地位。 |
 | 空间|`O(n)`| 间隔、链分配和输出数组都使用线性内存。 |

 至多有`150000`对，排序只需要几百万次比较级操作，其余工作是线性的。 内存使用量也与学生数量成线性关系，因此该解决方案完全符合 2 秒和 256 MB 的限制。 

## 测试用例

 输出不是唯一的，因此测试工具应该验证返回的排列，而不是将其与一个精确的字符串进行比较。 下面的助手检查每个输入对是否保持相邻，输出是否准确包含提供的高度，以及序列首先不递减，然后不递增。```python
import sys
import io

def solve_case(inp: str) -> str:
    data = list(map(int, inp.split()))
    it = iter(data)

    n = next(it)
    m = n // 2

    intervals = []
    global_max_idx = -1
    global_max_r = -1

    for i in range(m):
        a = next(it)
        b = next(it)
        l = min(a, b)
        r = max(a, b)
        intervals.append((l, r, i))

        if r > global_max_r:
            global_max_r = r
            global_max_idx = i

    intervals.sort()

    end = [-1, -1]
    color = [-1] * m

    for l, r, idx in intervals:
        if l >= end[0]:
            color[idx] = 0
            end[0] = r
        elif l >= end[1]:
            color[idx] = 1
            end[1] = r
        else:
            return "-1\n"

    if color[global_max_idx] == 0:
        for i in range(m):
            color[i] ^= 1

    left = []
    right = []

    for l, r, idx in intervals:
        if color[idx] == 0:
            left.append((l, r, idx))
        else:
            right.append((l, r, idx))

    left.sort(key=lambda x: (x[0], x[1]))
    right.sort(key=lambda x: (-x[1], -x[0]))

    ans = []

    for l, r, idx in left:
        ans.extend((l, r))

    for l, r, idx in right:
        ans.extend((r, l))

    return " ".join(map(str, ans)) + "\n"

def validate(inp: str, out: str) -> bool:
    data = list(map(int, inp.split()))
    n = data[0]
    pairs = [tuple(sorted(data[i:i + 2])) for i in range(1, len(data), 2)]

    if out.strip() == "-1":
        # Verify that the instance really has no solution by
        # checking the same two-chain condition.
        intervals = [(a, b) for a, b in pairs]
        intervals.sort()

        end = [-1, -1]

        for l, r in intervals:
            if l >= end[0]:
                end[0] = r
            elif l >= end[1]:
                end[1] = r
            else:
                return True

        return False

    ans = list(map(int, out.split()))

    if len(ans) != n:
        return False

    expected = sorted(x for pair in pairs for x in pair)
    if sorted(ans) != expected:
        return False

    # Every original pair must appear as two consecutive values.
    remaining = pairs[:]
    used = [False] * len(remaining)

    for i in range(0, n, 2):
        cur = tuple(sorted((ans[i], ans[i + 1])))

        found = False
        for j, pair in enumerate(remaining):
            if not used[j] and pair == cur:
                used[j] = True
                found = True
                break

        if not found:
            return False

    # Check mountain property.
    phase = 0
    for i in range(1, n):
        if phase == 0:
            if ans[i] < ans[i - 1]:
                phase = 1
        else:
            if ans[i] > ans[i - 1]:
                return False

    return True

def run(inp: str) -> str:
    return solve_case(inp)

sample1 = """\
8
1 3
4 2
6 7
5 7
"""

sample2 = """\
6
1 2
2 4
3 5
"""

assert validate(sample1, run(sample1)), "sample 1"
assert validate(sample2, run(sample2)), "sample 2"

# Minimum size.
case_min = """\
2
10 3
"""
assert validate(case_min, run(case_min)), "minimum-size case"

# All heights equal.
case_equal = """\
8
7 7
7 7
7 7
7 7
"""
assert validate(case_equal, run(case_equal)), "all-equal case"

# Touching intervals must be accepted.
case_touching = """\
6
1 2
2 3
3 4
"""
assert validate(case_touching, run(case_touching)), "touching intervals"

# Three mutually overlapping intervals, so no two-chain partition exists.
case_impossible = """\
6
1 5
2 4
3 6
"""
assert validate(case_impossible, run(case_impossible)), "impossible overlap case"

# Maximum-size stress test.
m = 150000
parts = [str(2 * m)]
for i in range(1, m + 1):
    parts.append(f"{i} {i + 1}")
case_max = "\n".join(parts) + "\n"

result = run(case_max)
assert validate(case_max, result), "maximum-size case"

print("All tests passed.")
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 样品1 | 任何有效的山区安排 | 两条不平凡的链的基本结构 |
 |`6 / 1 2 / 2 4 / 3 5`| 任何有效的山区安排 | 从一条链切换到另一条链形成的峰 |
 |`2 / 10 3`|`3 10`或者`10 3`| 最小可能的输入和一对 |
 | 四对`7 7`| 八`7`s | 等端点和重复等高度 |
 |`1 2`,`2 3`,`3 4`| 任何有效的安排 | 正确使用`>=`对于触摸间隔|
 |`1 5`,`2 4`,`3 6`|`-1`| 需要两条以上链条的三个重叠间隔 |
 |`150000`对`(i, i+1)`| 任何有效的安排 | 最大输入大小和`O(n log n)`性能 |

 ## 边缘情况

 对于接触间隔，请考虑```
6
1 2
2 3
3 4
```标准化间隔是`[1,2]`,`[2,3]`， 和`[3,4]`。 贪婪扫描可以将所有三个放入同一个链中，因为每个新的左端点恰好是前一个右端点。 所得递增序列为`1 2 2 3 3 4`，这是有效的。 使用`l >= end`这正是它的成功之处。 

对于一对内的峰值，考虑```
4
1 4
2 3
```间隔重叠，但只有两个，因此可以将它们放置在相对的两侧。 贪心赋值`[1,4]`和`[2,3]`进入不同的链条。 右端点最大的区间是`[1,4]`，所以它的链变成递减的一侧。 另一条链生产`2 3`， 和`[1,4]`写成`4 1`, 给予`2 3 4 1`。 即使间隔本身重叠，转换也是有效的。 

对于三个重叠的区间，考虑```
6
1 5
2 4
3 6
```排序后，`[1,5]`占据第一条链并且`[2,4]`占据第二位。 什么时候`[3,6]`被处理，`3 < 5`和`3 < 4`，所以两条链都不可用。 在高处`3`，所有三个区间重叠。 由于有效的山只有增加的一侧和减少的一侧，因此这些间隔中的至少两个必须共享一侧，这是不可能的。 算法正确打印`-1`。 

对于相等的对，考虑```
4
3 3
3 3
```两个间隔都是`[3,3]`。 第一个可以进入链`0`，而第二个可以进入链`1`因为`3 >= 3`。 建造完成后，两对都生产`3 3`，最终的序列是`3 3 3 3`。 这表明除了使用非严格比较之外，相等的端点和相等的对高度不需要任何特殊情况。 

对于最大输入大小，生成的应力情况包含`150000`形式对`(i, i+1)`。 每个间隔可以跟随前一个间隔，因为它的左端点等于前一个右端点。 贪婪扫描高效地分配它们而无需回溯，并且两个排序操作仍然保留`O(n log n)`。 这是原图所需要的比例`n <= 3 * 10^5`约束。
