---
title: "CF 106222A - 河流"
description: "每个人住在北岸的一个位置，在南岸的一个位置工作。 只能沿着河岸步行，而过河通常需要乘船，需要 B 时间单位。"
date: "2026-06-25T06:57:58+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106222
codeforces_index: "A"
codeforces_contest_name: "ZCO 2025"
rating: 0
weight: 106222
solve_time_s: 62
verified: true
draft: false
---

[CF 106222A - 河流](https://codeforces.com/problemset/problem/106222/A)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 2s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 每个人住在北岸的一个位置，在南岸的一个位置工作。 只能沿着河岸步行，而过河通常需要乘船`B`时间单位。 我们可能会在某个地点建造一座单桥`L`，而过那座桥正好需要`1`时间单位。 如果桥路线最多，一个人就会选择桥`T`时间单位比其最佳乘船路线慢。 我们要选择桥梁位置并找到最小的公差值`T`这样至少`M`人们使用这座桥。 

限制才是真正的挑战。 最多可以有`10^5`人，而位置和航行时间可以大到`10^9`。 任何尝试每个桥位置的解决方案都是不可能的，因为最多有`10^9`候选地点。 我们周围需要一些东西`O(N log N)`。 

一个微妙的点是，最佳的乘船路线不一定是直接穿越家庭位置或工作位置。 一个人可以先步行，然后乘船。 错过这一观察会导致旅行时间不正确。 

考虑一个人`H = 2`,`W = 8`,`B = 5`。 

最佳乘船路线为：```
walk from 2 to any position between 2 and 8
cross by boat
walk to 8
```其成本为`|2 - 8| + 5 = 11`， 不是`5`。 

另一个容易犯的错误是忘记桥位置必须是整数。 当不等式涉及除以二时，必须小心处理舍入。 

例如：```
H = 4, W = 4, B = 1
```如果`T = 0`，仅在该位置建造了一座桥梁`4`是可以接受的。 将位置视为连续会错误地允许附近的位置。 

## 方法

 暴力方法会尝试每个桥梁位置`L`从`0`到`K - 1`。 对于每个位置，我们可以计算有多少人会使用这座桥，然后确定所需的容差。 即使评估一个地点只需要`O(N)`，总复杂度为`O(NK)`，这是无望的，当`K`可以达到`10^9`。 

关键的观察结果来自表达使用桥梁的额外成本。 

让```
l = min(H, W)
r = max(H, W)
```最佳乘船旅行时间为```
|H - W| + B
```因为跨越两者之间的任何地方`H`和`W`最大限度地减少步行距离。 

如果桥位于该位置`L`，桥梁行程时间为```
|H - L| + 1 + |W - L|
```额外的成本变成```
|H - L| + |W - L| - |H - W| + (1 - B)
```前三个术语具有有用的几何意义：```
|H - L| + |W - L| - |H - W|
= 2 * distance(L, [l, r])
```在哪里`distance(L, [l, r])`是距离`L`到间隔`[l, r]`。 

所以一个人使用桥当且仅当```
2 * distance(L, [l, r]) + (1 - B) <= T
```重新排列：```
distance(L, [l, r]) <= (T + B - 1) / 2
```让```
D = floor((T + B - 1) / 2)
```由于距离是整数，因此条件变为```
distance(L, [l, r]) <= D
```这意味着这个人接受里面的每个桥梁位置```
[l - D, r + D]
```剪辑后到`[0, K - 1]`。 

对于固定的`D`，每个人贡献一个可接受的桥梁位置区间。 我们只需要知道某个位置是否至少被覆盖`M`间隔。 

这是一个标准的最大重叠问题。 使用具有差异事件的扫描线给出`O(N log N)`查看。 

重叠计数是单调的`D`，所以我们可以二分查找最小的`D`这至少允许`M`人们。 获得后`D`，我们将其转换回最小公差`T`。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(NK) | O(1) | O(1) | 太慢了|
 | 最佳| O(N log N log K) | O(N log N log K) | O(N) | 已接受 |

 ## 算法演练

 1. 对于每个人，计算间隔```
[l, r] = [min(H, W), max(H, W)]
```2.二分查找最小整数`D`使得存在至少被覆盖的桥梁位置`M`扩大了间隔。 
3.在检查固定`D`，将每个区间展开为```
[max(0, l - D), min(K - 1, r + D)]
```这些正是该人可接受的桥梁位置。 
4. 将间隔转换为扫描事件：```
+1 at left endpoint
-1 at right endpoint + 1
```5. 对所有事件位置进行排序并从左到右扫描，保持当前的重叠计数。 
6. 如果重叠至少达到`M`， 这`D`是可行的。 
7. 二分查找找到最小可行值后`D`，恢复最小公差值。 

我们需要```
floor((T + B - 1) / 2) >= D
```满足这个条件的最小非负整数是```
T = max(0, 2 * D - (B - 1))
```### 为什么它有效

 对于固定人员来说，数量```
|H - L| + |W - L| - |H - W|
```正好是距离的两倍`L`到家和工作场所之间的间隔。 将该间隔扩展为`D`两侧精确地产生满足公差条件的一组桥位置。 

一个桥的位置是可行的当且仅当它至少属于`M`这些扩展的间隔。 扫描线计算覆盖任何位置的最大间隔数，因此它可以正确确定给定的可行性`D`。 

因为增加`D`仅仅扩大区间，可行性是单调的。 因此，二分搜索找到最小可行的`D`。 最终公式将最小值转换为`D`回到最低容忍度`T`，所以答案是最优的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, m, k, b = map(int, input().split())

    segs = []
    for _ in range(n):
        h, w = map(int, input().split())
        l = min(h, w)
        r = max(h, w)
        segs.append((l, r))

    def feasible(d):
        events = []

        for l, r in segs:
            left = max(0, l - d)
            right = min(k - 1, r + d)

            events.append((left, 1))
            events.append((right + 1, -1))

        events.sort()

        cur = 0
        i = 0
        while i < len(events):
            pos = events[i][0]

            delta = 0
            while i < len(events) and events[i][0] == pos:
                delta += events[i][1]
                i += 1

            cur += delta
            if cur >= m:
                return True

        return False

    lo = 0
    hi = k

    while lo < hi:
        mid = (lo + hi) // 2
        if feasible(mid):
            hi = mid
        else:
            lo = mid + 1

    d = lo
    t = max(0, 2 * d - (b - 1))
    print(t)

solve()
```第一部分仅存储每个人的家庭和工作场所之间的间隔。 这个间隔就是我们稍后所需要的。 

可行性检查将每个区间扩展为`D`，将其剪辑到有效的桥接范围，并执行扫描线。 使用`right + 1`删除事件是包含区间的标准技巧。 

二分查找运行于`D`，不直接在`T`。 重叠结构仅取决于`D`，这使得支票更加干净。 

所有算术都使用 Python 整数，因此值可达`10^9`及以上均得到安全处理。 

## 工作示例

 ### 示例 1

 输入：```
5 3 10 1
1 2
7 4
4 3
9 9
0 0
```为了`D = 1`:

 | 人 | 原始间隔| 扩大间隔 |
 | --- | --- | --- |
 | 1 | [1, 2] | [0, 3] |
 | 2 | [4, 7] | [3, 8] |
 | 3 | [3, 4] | [2, 5] |
 | 4 | [9, 9] | [8, 9] |
 | 5 | [0, 0] | [0, 1] |

 在地点`L = 3`，前三个区间重叠。 

| 地点 | 覆盖范围|
 | --- | --- |
 | 3 | 3 |

 所以`D = 1`是可行的。 

答案是```
T = max(0, 2 * 1 - (1 - 1))
  = 2
```### 示例 2

 输入：```
2 2 8 1
1 1
6 6
```为了`D = 2`:

 | 人 | 扩大间隔 |
 | --- | --- |
 | 1 | [0, 3] |
 | 2 | [4, 7] |

 不存在重叠。 

为了`D = 3`:

 | 人 | 扩大间隔 |
 | --- | --- |
 | 1 | [0, 4] |
 | 2 | [3, 7] |

 地点`3`和`4`被两个区间覆盖，所以`D = 3`是可行的。 

然后```
T = 2 * 3 = 6
```与示例输出匹配。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(N log N log K) | O(N log N log K) | 二分查找结束`D`，每个检查都会执行一次扫描`2N`活动 |
 | 空间| O(N) | 事件列表和存储间隔|

 和`N = 10^5`和`log K ≈ 30`，这很容易符合限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def run(inp: str) -> str:
    input_data = io.StringIO(inp)
    output_data = io.StringIO()

    sys.stdin = input_data
    sys.stdout = output_data

    import sys
    input = sys.stdin.readline

    n, m, k, b = map(int, input().split())

    segs = []
    for _ in range(n):
        h, w = map(int, input().split())
        segs.append((min(h, w), max(h, w)))

    def feasible(d):
        events = []
        for l, r in segs:
            L = max(0, l - d)
            R = min(k - 1, r + d)
            events.append((L, 1))
            events.append((R + 1, -1))

        events.sort()

        cur = 0
        i = 0
        while i < len(events):
            pos = events[i][0]
            delta = 0
            while i < len(events) and events[i][0] == pos:
                delta += events[i][1]
                i += 1
            cur += delta
            if cur >= m:
                return True
        return False

    lo, hi = 0, k
    while lo < hi:
        mid = (lo + hi) // 2
        if feasible(mid):
            hi = mid
        else:
            lo = mid + 1

    ans = max(0, 2 * lo - (b - 1))
    print(ans)

    sys.stdout = sys.__stdout__
    return output_data.getvalue()

# provided samples
assert run("5 3 10 1\n1 2\n7 4\n4 3\n9 9\n0 0\n") == "2\n"
assert run("5 4 10 2\n1 2\n7 4\n4 3\n9 9\n0 0\n") == "3\n"
assert run("5 5 10 4\n1 2\n7 4\n4 3\n9 9\n0 0\n") == "7\n"
assert run("2 2 8 1\n1 1\n6 6\n") == "6\n"

# custom cases
assert run("1 1 5 10\n2 2\n") == "0\n"
assert run("3 2 10 1\n5 5\n5 5\n5 5\n") == "0\n"
assert run("2 2 10 1\n0 0\n9 9\n") == "10\n"
assert run("2 1 10 1\n0 9\n9 0\n") == "0\n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单人大船时间| 0 | 桥已经比船快了 |
 | 所有间隔相同 | 0 | 一点上的最大重叠 |
 | 城市的两端| 10 | 10 大扩展需求 |
 | 只需要一个用户 | 0 | 最低限度`M`行为 |

 ## 边缘情况

 考虑：```
1 1 5 10
2 2
```桥所在位置`2`需要时间`1`，而船需要时间`10`。 桥已经好了，所以宽容`0`就足够了。 该算法发现`D = 0`，然后计算```
T = max(0, -(B - 1)) = 0
```这是正确的。 

现在考虑：```
2 2 8 1
1 1
6 6
```原始区间是不相交的。 该算法在二分搜索期间扩展了两个区间。 第一个可行值是`D = 3`，其中扩展的区间变为`[0,4]`和`[3,7]`。 它们是重叠的，所以一个桥梁位置就可以满足两个人的需求。 由此产生的公差是```
T = 2 * 3 = 6
```符合预期的答案。 

最后，考虑舍入敏感的情况：```
1 1 10 1
4 4
```为了`T = 0`，我们得到```
D = floor((0 + 1 - 1)/2) = 0
```所以可接受的桥接间隔仍然存在`[4,4]`。 唯一的位置`4`完全按照要求工作。 整数公式避免了半整数距离引起的任何错误。
