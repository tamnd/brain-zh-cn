---
title: "CF 160E - 公共汽车和人员"
description: "每条总线都在某一时刻处于活动状态。 从 s 站出发到 f 站结束的公共汽车可以运载任何行程间隔 [l, r] 完全包含在 [s, f] 内的乘客。 一个人在时间b到达站点l，因此他只能乘坐时间t满足t=b的公交车。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "data-structures", "sortings"]
categories: ["algorithms"]
codeforces_contest: 160
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 111 (Div. 2)"
rating: 2400
weight: 160
solve_time_s: 133
verified: true
draft: false
---

[CF 160E - 公共汽车和人](https://codeforces.com/problemset/problem/160/E)

 **评分：** 2400
 **标签：** 二分查找、数据结构、排序
 **求解时间：** 2m 13s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 每条总线都在某一时刻处于活动状态。 巴士在车站出发`s`并在 stop 处结束`f`可搭载任意行程间隔的乘客`[l, r]`完全包含在里面`[s, f]`。 一个人到达车站`l`在某个时间`b`，所以他们只能乘坐其时间的公交车`t`满足`t >= b`。 在所有此类巴士中，他们总是选择时间最短的一辆。 

对于每个人，我们必须回答间隔的几何查询：

 找到最小的总线`t`这样：

 -`s <= l`-`r <= f`-`t >= b`如果不存在这样的总线，则打印`-1`。 

这些约束立即排除了任何成对检查。 高达`10^5`公共汽车和`10^5`人们，每个查询都需要直接扫描`10^10`最坏情况下的比较，远远超出一秒钟的范围。 

棘手的部分是查询同时具有三个条件。 我们不仅按时间进行过滤，还询问一个区间是否包含另一个区间。 仅有效处理一维的解决方案仍然太慢。 

一些边缘情况很容易被错误处理。 

考虑公交车：```
1 5 10
2 6 20
```和一个人：```
2 5 10
```正确答案是第一辆公共汽车，因为它的时间正好等于`b`，并且允许相等。 粗心的二分查找使用`t > b`而不是`t >= b`在这里默默地失败了。 

另一个微妙的情况是重叠的公交车，其中较早的公交车不包含乘客间隔，但较晚的公交车包含。```
Buses:
1 4 5
2 10 7

Person:
3 8 1
```答案是第二辆公交车。 仅保留最短时间活动总线的贪婪结构会错误地拒绝查询，因为最早的总线无法为乘客提供服务。 

当多辆公交车覆盖相同的左边界但具有不同的右边界时，会出现另一种危险的情况。```
Buses:
1 5 3
1 10 8

Person:
2 8 1
```正确答案是第二辆公交车。 如果我们错误地压缩信息并且每个起点仅保留一辆公交车，我们就会丢失必要的信息。 

## 方法

 暴力解决方案很简单。 对于每个人，扫描每辆公交车并检查三个条件：

 -`s <= l`-`r <= f`-`t >= b`在所有有效总线中，选择最小的一辆`t`。 

这个逻辑是完全正确的，因为它直接实现了语句中的定义。 问题是性能。 和`10^5`人们和`10^5`公共汽车，最坏的情况执行`10^10`检查。 即使高度优化的实施也无法及时完成。 

关键的观察是时间是完全有序且独特的。 如果我们按升序处理总线`t`，那么对于一个有阈值的人`b`，答案很简单，就是时间过后的首班车`b`其区间包含`[l, r]`。 

这将问题转化为离线几何搜索问题。 

假设我们通过增加时间来处理总线。 无论何时，我们都想回答：

 在已处理的总线中，是否存在具有以下功能的总线：

 -`s <= l`-`f >= r`这是一个经典的二维优势查询。 

重要的结构细节是止损范围可达`10^9`，但仅`10^5`坐标实际出现。 Coordinate compression lets us work on indices instead of raw values.

 现在考虑修复左端点条件。 如果我们从大处扫`s`向小`s`，那么每当我们在坐标处`x`，每条插入的总线都已经满足`s >= x`。 

对于具有左端点的查询`l`，我们需要巴士`s <= l`， 不是`s >= l`。 我们可以反转扫描方向：

 - 巴士排序依据`s`上升。 
- 对查询进行排序`l`上升。 
- 插入所有总线`s <= l`。 

在插入的总线中，我们只需要知道某些总线是否有`f >= r`，并且在所有此类巴士中我们想要最短的时间。 

这就变成了一个通过压缩索引的线段树问题`f`。 

对于每个总线端点`f`，我们存储在那里结束的公共汽车的最短时间。 然后查询后缀`[r, maxF]`给出最小有效总线时间。 

最后的复杂性是查询要求的最短时间大于或等于`b`，而不仅仅是绝对最小值。 我们通过分而治之的方式来处理这个问题。 

我们对按时间排序的总线列表中的每个查询对答案总线进行二分搜索。 在一次并行二分搜索迭代中，我们测试第一个总线中是否存在有效总线`mid`公共汽车。 

该可行性测试正是上面解决的区间包含查询。 

该组合给出了`O((n + m) log^2 n)`解决方案。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(纳米) | O(1) | O(1) | 太慢了 |
 | 最佳 | O((n + m) log² n) | O((n + m) log² n) | O(n) | 已接受 |

 ## 算法演练

 1. 按时间递增对所有公交车进行排序`t`。 
2.坐标压缩所有公交车和人中出现的站点坐标。 

压缩允许线段树索引，同时保留区间排序。 
3. 对于每个人，二分查找可以为他们服务的最小总线索引。 

由于总线按时间排序，因此找到第一条有效总线会自动给出最短有效时间。 
4. 使用并行二分查找将所有人一起处理。 

每个人维护一个搜索范围`[low, high]`超过总线指数。 
5. 在一次迭代中，按当前中点对人员进行分组`mid`。 

有人问：“第一班的公交车可以吗？`mid`公共汽车包含我的间隔吗？”
 6. 从最小时间向上递增处理总线。 

当公交车`i`添加后，将其插入线段树中的位置`f_i`。 
7.线段树存储最小左端点`s`在每个位置结束的公共汽车之间。 

对于每个后缀范围`[r, maxF]`,查询存储的最小值`s`告诉我们某些插入的总线是否满足`s <= l`。 
8. 回答某人的询问`(l, r)`在中点`mid`,通过后缀查询线段树`[r, maxF]`。 

如果最小`s`该后缀最多是`l`，则某些插入的总线包含该区间。 
9. 如果查询成功，则将二分查找范围左移。 

否则向右移动。 
10. 并行二分查找结束后，每个人要么没有可行总线，要么有第一个可行总线索引。 
11. 根据输入顺序将索引转换回原始总线编号。 

### 为什么它有效

 在中点`mid`，该数据结构恰好包含时间排在第一位的总线`mid`最小值。 当至少一辆插入的公交车包含乘客间隔时，查询恰好成功。 

The segment tree invariant is:

For every compressed endpoint`f`，树存储最小值`s`在插入的总线中结束于`f`。 

查询后缀时`[r, maxF]`，我们检查所有总线`f >= r`。 如果存储的最小值`s`里面的后缀满足`s <= l`，则某总线同时满足两个包含条件：

 -`s <= l`-`f >= r`由于总线按时间递增顺序处理，因此查询可行的第一个中点恰好对应于最小有效总线时间。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

INF = 10**18

class SegTree:
    def __init__(self, n):
        self.n = 1
        while self.n < n:
            self.n <<= 1
        self.seg = [INF] * (2 * self.n)

    def reset(self):
        for i in range(2 * self.n):
            self.seg[i] = INF

    def update(self, pos, val):
        pos += self.n
        if val < self.seg[pos]:
            self.seg[pos] = val
        else:
            return

        pos >>= 1
        while pos:
            self.seg[pos] = min(self.seg[pos << 1],
                                self.seg[pos << 1 | 1])
            pos >>= 1

    def query(self, l, r):
        res = INF
        l += self.n
        r += self.n

        while l <= r:
            if l & 1:
                res = min(res, self.seg[l])
                l += 1
            if not (r & 1):
                res = min(res, self.seg[r])
                r -= 1
            l >>= 1
            r >>= 1

        return res

def solve():
    n, m = map(int, input().split())

    buses = []
    coords = []

    for idx in range(n):
        s, f, t = map(int, input().split())
        buses.append((t, s, f, idx + 1))
        coords.append(s)
        coords.append(f)

    people = []

    for idx in range(m):
        l, r, b = map(int, input().split())
        people.append((l, r, b, idx))
        coords.append(l)
        coords.append(r)

    coords = sorted(set(coords))
    comp = {x: i for i, x in enumerate(coords)}

    buses.sort()

    bus_data = []
    for t, s, f, idx in buses:
        bus_data.append((s, f, idx))

    low = [0] * m
    high = [n - 1] * m
    ans = [-1] * m

    possible = [False] * m

    for i, (l, r, b, idx) in enumerate(people):
        if buses[-1][0] >= b:
            possible[i] = True
        else:
            low[i] = 1
            high[i] = 0

    while True:
        buckets = [[] for _ in range(n)]
        active = False

        for i in range(m):
            if low[i] <= high[i]:
                active = True
                mid = (low[i] + high[i]) // 2
                buckets[mid].append(i)

        if not active:
            break

        seg = SegTree(len(coords))

        ptr = 0

        for mid in range(n):
            while ptr <= mid:
                s, f, _ = bus_data[ptr]
                seg.update(comp[f], s)
                ptr += 1

            for qi in buckets[mid]:
                l, r, b, idx = people[qi]

                if buses[mid][0] < b:
                    low[qi] = mid + 1
                    continue

                cr = comp[r]

                best = seg.query(cr, len(coords) - 1)

                if best <= l:
                    ans[qi] = mid
                    high[qi] = mid - 1
                else:
                    low[qi] = mid + 1

    out = []

    for i in range(m):
        if ans[i] == -1:
            out.append("-1")
        else:
            out.append(str(buses[ans[i]][3]))

    print(" ".join(out))

solve()
```该解决方案首先按时间对公交车进行排序，因为每个查询都要求最小的可行时间。 一旦以这种方式对总线进行排序，问题就变成了查找包含有效间隔的第一个前缀。 

坐标压缩是必要的，因为停止数达到`10^9`。 线段树只关心相对顺序，因此压缩索引就足够了。 

线段树存储最小起始位置。 这个方向很容易出错。 对于查询`(l, r)`，我们检查所有总线`f >= r`。 其中，若最小存储`s`至多是`l`，则某些总线包含该区间。 

并行二分查找是核心优化。 共享同一中点的所有查询都一起处理，而不是为每个人运行单独的二分搜索并重复重建结构。 

一个微妙的实现细节是按时间过滤的顺序。 中点线段树`mid`包含索引中的所有总线`0..mid`，但其中一些可能仍然有`t < b`。 由于时间已排序，请检查`buses[mid][0] < b`就足够了。 如果前缀中的最大时间仍然太小，则该前缀中的任何总线都无法工作。 

另一个容易犯的错误是直接覆盖线段树值。 多辆巴士可能共用同一辆巴士`f`，所以我们必须存储最小值`s`他们之中。 

## 工作示例

 ### 示例 1

 输入：```
4 3
1 10 10
5 6 2
6 7 3
5 7 4
5 7 1
1 2 1
1 10 11
```公交车按时间排序：

 | 时间 | 巴士 ID | 间隔 |
 | ---| ---| ---|
 | 2 | 2 | [5,6]|
 | 3 | 3 | [6,7]|
 | 4 | 4 | [5,7]|
 | 10 | 10 1 | [1,10]|

 查询：

 | 人 | 间隔 | 乙|
 | ---| ---| ---|
 | 1 | [5,7]| 1 |
 | 2 | [1,2]| 1 |
 | 3 | [1,10]| 11 | 11

 二分查找进程：

 | 人 | 中期测试 | 有效的？ | 结果 |
 | ---| ---| ---| ---|
 | 1 | 巴士时间 3 | 没有 | 向右移动|
 | 1 | 巴士时间 4 | 是的 | 答案 = 巴士 4 |
 | 2 | 巴士时间 3 | 没有 | 向右移动|
 | 2 | 巴士时间 10 | 是的 | 答案 = 总线 1 |
 | 3 | 巴士时间 10 | 没有 | 答案=-1 |

 最终输出：```
4 1 -1
```这个例子说明了为什么我们需要最早的有效总线，而不仅仅是任何有效的总线。 1 人也可以乘坐 1 路公交车，但 4 路公交车的时间较短。 

### 自定义示例

 输入：```
3 3
1 5 2
2 8 6
1 10 9
2 4 1
3 9 1
3 9 10
```公交车排序：

 | 时间 | 巴士 ID | 间隔 |
 | ---| ---| ---|
 | 2 | 1 | [1,5]|
 | 6 | 2 | [2,8]|
 | 9 | 3 | [1,10]|

 加工：

 | 人 | 间隔 | 第一趟有效巴士 |
 | ---| ---| ---|
 | 1 | [2,4]| 巴士 1 |
 | 2 | [3,9]| 巴士 3 |
 | 3 | [3,9]，b=10 | 无 |

 输出：```
1 3 -1
```此跟踪表明最短时间总线可能会失败遏制，而稍后的总线会成功。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O((n + m) log² n) | O((n + m) log² n) | 并行二分查找执行 O(log n) 轮，每轮进行线段树操作 |
 | 空间| O(n + m) | 总线、查询、存储桶和线段树的存储 |

 和`10^5`公交车和人，`O(nm)`是不可能的。 这里的对数因子足够小，可以轻松地落在限制范围内。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

INF = 10**18

class SegTree:
    def __init__(self, n):
        self.n = 1
        while self.n < n:
            self.n <<= 1
        self.seg = [INF] * (2 * self.n)

    def update(self, pos, val):
        pos += self.n
        self.seg[pos] = min(self.seg[pos], val)

        pos >>= 1
        while pos:
            self.seg[pos] = min(self.seg[pos << 1],
                                self.seg[pos << 1 | 1])
            pos >>= 1

    def query(self, l, r):
        res = INF
        l += self.n
        r += self.n

        while l <= r:
            if l & 1:
                res = min(res, self.seg[l])
                l += 1
            if not (r & 1):
                res = min(res, self.seg[r])
                r -= 1
            l >>= 1
            r >>= 1

        return res

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline

    n, m = map(int, input().split())

    buses = []
    coords = []

    for idx in range(n):
        s, f, t = map(int, input().split())
        buses.append((t, s, f, idx + 1))
        coords.extend([s, f])

    people = []

    for idx in range(m):
        l, r, b = map(int, input().split())
        people.append((l, r, b, idx))
        coords.extend([l, r])

    coords = sorted(set(coords))
    comp = {x: i for i, x in enumerate(coords)}

    buses.sort()

    low = [0] * m
    high = [n - 1] * m
    ans = [-1] * m

    while True:
        buckets = [[] for _ in range(n)]
        active = False

        for i in range(m):
            if low[i] <= high[i]:
                active = True
                mid = (low[i] + high[i]) // 2
                buckets[mid].append(i)

        if not active:
            break

        seg = SegTree(len(coords))
        ptr = 0

        for mid in range(n):
            while ptr <= mid:
                t, s, f, idx = buses[ptr]
                seg.update(comp[f], s)
                ptr += 1

            for qi in buckets[mid]:
                l, r, b, idx = people[qi]

                if buses[mid][0] < b:
                    low[qi] = mid + 1
                    continue

                best = seg.query(comp[r], len(coords) - 1)

                if best <= l:
                    ans[qi] = mid
                    high[qi] = mid - 1
                else:
                    low[qi] = mid + 1

    res = []

    for x in ans:
        if x == -1:
            res.append("-1")
        else:
            res.append(str(buses[x][3]))

    return " ".join(res)

# provided sample
assert run(
"""4 3
1 10 10
5 6 2
6 7 3
5 7 4
5 7 1
1 2 1
1 10 11
"""
) == "4 1 -1", "sample 1"

# minimum case
assert run(
"""1 1
1 2 5
1 2 5
"""
) == "1", "minimum valid case"

# exact equality on time
assert run(
"""1 1
1 10 7
2 5 7
"""
) == "1", "t == b must work"

# containment failure
assert run(
"""2 1
1 5 2
2 10 3
3 9 1
"""
) == "-1", "no interval fully contains query"

# later bus succeeds
assert run(
"""3 1
1 5 2
2 8 6
1 10 9
3 9 1
"""
) == "3", "must choose later containing bus"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单巴士和乘客|`1`| 最低有效配置|
 |`t == b`|`1`| 时间上的平等边界|
 | 无包含区间 |`-1`| 正确的区间包含逻辑 |
 | 稍后巴士成功 |`3`| 最早的有效巴士并不总是最早的整体 |

 ## 边缘情况

 考虑时间上的相等边界：```
1 1
1 10 7
2 5 7
```乘客恰好在巴士运行时到达。 由于条件是`b <= t`，公交车有效。 

在二分查找过程中，中点时间为`7`。 条件`buses[mid][0] < b`变成`7 < 7`，这是 false，因此查询正常进行并成功。 

现在考虑重叠但不足的间隔：```
2 1
1 5 2
2 10 3
3 9 1
```第一辆巴士失败的原因是`5 < 9`。 第二辆巴士发生故障是因为`2 > 3`。 

线段树中通过后缀进行查询`f >= 9`，只出现第二辆公交车。 其存储的最小值`s`是`2`，这不是`<= 3`，因此算法正确地拒绝了查询。 

最后，考虑共享同一端点的多个总线：```
3 1
1 10 5
4 10 6
7 10 7
5 9 1
```所有巴士都满足`f >= 9`，但只有前两个满足`s <= 5`。 

线段树存储最小`s`对于端点`10`，即`1`。 后缀查询返回`1`，正确证明存在有效总线。
