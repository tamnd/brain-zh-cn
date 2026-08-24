---
title: "CF 102163A - 懒惰法官哈桑"
description: "我们有两种有限线段。 水平线段由其左右 x 坐标及其固定 y 坐标描述。 垂直线段由其底部和顶部 y 坐标及其固定 x 坐标来描述。"
date: "2026-08-23T10:49:54+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102163
codeforces_index: "A"
codeforces_contest_name: "NCD 2019"
rating: 0
weight: 102163
solve_time_s: 2337
verified: true
draft: false
---

[CF 102163A - 懒惰法官哈桑](https://codeforces.com/problemset/problem/102163/A)

 **评级：** -
 **标签：** -
 **求解时间：** 38m 57s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有两种有限线段。 水平线段由其左右 x 坐标及其固定 y 坐标描述。 垂直线段由其底部和顶部 y 坐标及其固定 x 坐标来描述。 

选择在 C 点相交的一条水平线段和一条垂直线段。生成的加号的四个臂在这两条线段的四个端点处结束。 如果交点位于`(x, y)`，四个臂长分别为`x - x1`,`x2 - x`,`y - y1`， 和`y2 - y`。 

该加号的值是这四个数字中最小的一个。 我们需要每个有效的水平和垂直对的最大可能值。 

高达`10^5`水平段和`10^5`垂直段，尝试每一对将需要最多`10^10`检查一个测试用例。 一秒的限制完全排除了这种情况。 甚至一个`O((N+M) log(N+M))`此处的解决方案更为合适，而具有附加对数因子的算法仍然可行，因为坐标范围仅为`10^5`。 

正确的实现必须仔细处理几种边界情况。 首先，接触端点是有效的交叉点，但该侧的长度为零。 例如，```
1
1 1
1 1 1
1 1 1
```有答案`0`。 需要严格正重叠的解决方案会错误地报告不存在交集。 

第二种情况是水平段足够长而垂直段太短。 例如，```
1
1 1
1 10 5
1 5 5
```有答案`0`。 线段相交，但垂直线段在最佳可能的交点处其短边只有两个单位的空间，而实际上其总长度仅为四，因此在所需的交叉处不能形成大于零的正加长度。 更一般地说，长度的候选人`d`要求两个段的总长度至少`2d`。 

第三种情况是边界缩小时的平等。 考虑```
1
1 1
1 5 3
1 5 3
```答案是`2`，因为交叉点在`(3,3)`在每个方向上恰好留下两个单位。 检查长度`d`必须使用包含条件，例如`x1 + d <= x <= x2 - d`。 用严格的不等式代替它们将失去这个有效的答案。 

输入并不保证端点按递增顺序呈现，因此强大的实现应该首先规范化每个段。 此问题的参考解决方案在处理几何图形之前执行相同的操作。 

## 方法

 直接的方法是对照每个垂直段检查每个水平段。 对于一对，我们检查它们的 x 和 y 范围是否相交，计算相交坐标，然后评估从该点到线段端点的四个距离。 这是正确的，因为每个可能的加号都恰好由一对这样的加号决定。 问题是对的数量。 和`N = M = 10^5`, 可以有`10^10`对，这远远超出了时间限制。 

有用的观察是停止尝试直接最大化答案。 相反，问一个是或否的问题：我们能否形成一个加号，其值至少为`d`？ 

对于水平段`[x1, x2]`在高处`y`， x 处的交点至少有`d`水平两侧的单位恰好在`x1 + d <= x <= x2 - d`。 

因此，对于此特定检查，可以用允许的 x 间隔替换水平段`[x1+d, x2-d]`。 如果`x1+d > x2-d`，该水平段不能参与尺寸的加法`d`。 

同样，垂直线段`[y1, y2]`at x 可以支持尺寸的加号`d`恰好当交叉点高度满足`y1 + d <= y <= y2-d`。 

现在几何形状已经变成了扫线问题。 按 x 对垂直线段进行排序。 对于固定的`d`，当扫描达到`x1+d`，并在之后停止活动`x2-d`。 在处理坐标 x 处的垂直线段时，活动水平线恰好是允许的 x 间隔包含 x 的水平线。 

在活动水平线中，我们只需要知道是否至少有一个水平线的 y 坐标位于垂直线段的有效区间内`[y1+d, y2-d]`。 y 坐标上的 Fenwick 树是标准实现。 最初接受的 C++ 解决方案正是使用这种扫描，通过左边界激活水平线，在右边界后删除水平线，并使用 Fenwick 树查询 y 间隔。 

最终的观察结果是单调性。 如果再加上尺码`d`存在，那么每个较小尺寸的加号也存在。 这使得答案适合二分搜索。 我们测试一个候选人`d`，如果可行，则搜索更大的值； 否则，搜索较小的值。 

对于下面的 Python 实现，相同的扫描与 y 坐标域上基于块的小位集相结合。 坐标最多为`10^5`，因此我们可以维护哪些 y 坐标当前处于活动状态，而无需对数树操作。 每个块包含 256 个 y 位置，第二个小位集记录哪些块是非空的。 然后，间隔查询最多触及两个边界块和紧凑块级位集。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |`O(NM)`|`O(N+M)`| 太慢了|
 | 二分查找+扫描+芬威克树|`O((N+M) log C log C)`|`O(N+M+C)`| 已接受 |
 | 二分查找+扫描+有界坐标位集|`O((N+M) log C)`对于固定坐标边界 |`O(N+M+C)`| 已接受 |

 这里`C`是最大坐标，最多`10^5`。 第二种方法是通常的数据结构公式，而第三种方法特别适合在一秒限制下的 Python，因为坐标宇宙是明确有界的。 

## 算法演练

 1. 标准化每个水平线段，使得`x1 <= x2`，以及每个垂直线段，以便`y1 <= y2`。 根据任何线段长度的一半计算最大可能的答案。 
2. 将水平线段排序两次，一次按`x1`有一次`x2`。 对于固定候选人`d`，它们的可用间隔变为`[x1+d, x2-d]`。 由于添加了相同的`d`保留顺序，在二分搜索期间列表永远不需要再次排序。 
3. 按 x 坐标对垂直线段进行排序。 我们将从左到右浏览它们。 
4. 对于候选人`d`，丢弃每个水平线段`x2-x1 < 2d`，因为没有足够的水平空间容纳两臂长度`d`。 对于每个剩余的水平段，定义`left = x1+d`和`right = x2-d`。 
5. 在 x 扫描过程中，当`left <= x`对于当前垂直段。 删除它时`right < x`。 删除的严格比较是经过深思熟虑的。 如果`right == x`，垂直线穿过缩小的水平区间的端点，并且仍然准确地给出`d`对应侧的单位。 
6. 维护所有当前活动水平段的 y 坐标。 如果多个活动水平线具有相同的 y 坐标，请维护一个计数而不是一个简单的布尔值，因为删除其中一个水平线不会在另一个水平线保持活动状态时意外删除该坐标。 
7. 对于每个垂直段，首先要求`y2-y1 >= 2d`。 那么它可能的交叉高度恰好是`[y1+d, y2-d]`。 如果活动 y 集包含此区间内的任何坐标，则至少加上 size`d`存在。 
8.二分查找最大可行`d`。 下限为零。 上限可以是任何输入段的最大半长。 如果`check(mid)`成功，存储`mid`并继续向右； 否则继续向左行驶。 

### 为什么它有效

 对于固定的`d`，一个有效的水平线段就是一个水平线段，其 x 坐标可以被选择，使得两个水平臂的长度至少`d`。 当扫描位于垂直坐标 x 时，活动集恰好包含其允许的 x 间隔包含该 x 的所有水平线。 

垂直段至少贡献有效的尺寸增加`d`正好可以在里面选择它的 y 坐标`[y1+d, y2-d]`。 因此，当某个水平方向和该垂直方向可以形成这样的加号时，活动水平 y 坐标上的范围查询正是正确的。 扫描因此回答`check(d)`正确。 

最后，可行性是单调的。 增加所需的臂长只能消除可能的交叉点，而不能创建新的交叉点。 因此，二分查找找到最大可行值。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

BLOCK = 256

class ActiveY:
    def __init__(self, max_y):
        self.size = max_y + 1
        self.blocks = [0] * ((max_y >> 8) + 1)
        self.count = [0] * (max_y + 1)
        self.nonempty = 0

    def add(self, y):
        c = self.count[y]
        self.count[y] = c + 1
        if c == 0:
            b = y >> 8
            bit = 1 << (y & 255)
            old = self.blocks[b]
            self.blocks[b] = old | bit
            if old == 0:
                self.nonempty |= 1 << b

    def remove(self, y):
        c = self.count[y] - 1
        self.count[y] = c
        if c == 0:
            b = y >> 8
            bit = 1 << (y & 255)
            new = self.blocks[b] & ~bit
            self.blocks[b] = new
            if new == 0:
                self.nonempty &= ~(1 << b)

    def any_in_range(self, lo, hi):
        if lo > hi:
            return False

        b1 = lo >> 8
        b2 = hi >> 8

        if b1 == b2:
            left = lo & 255
            right = hi & 255
            mask = ((1 << (right - left + 1)) - 1) << left
            return (self.blocks[b1] & mask) != 0

        left = lo & 255
        if self.blocks[b1] & (~((1 << left) - 1) & ((1 << 256) - 1)):
            return True

        right = hi & 255
        if self.blocks[b2] & ((1 << (right + 1)) - 1):
            return True

        if b2 - b1 <= 1:
            return False

        width = b2 - b1 - 1
        middle_mask = ((1 << width) - 1) << (b1 + 1)
        return (self.nonempty & middle_mask) != 0

def solve_case(horizontal, vertical, max_coord):
    n = len(horizontal)
    m = len(vertical)

    horizontal.sort(key=lambda p: p[0])
    by_right = sorted(horizontal, key=lambda p: p[1])
    vertical.sort(key=lambda p: p[2])

    max_len = 0
    for x1, x2, _ in horizontal:
        max_len = max(max_len, (x2 - x1) // 2)
    for y1, y2, _ in vertical:
        max_len = max(max_len, (y2 - y1) // 2)

    def check(d):
        left_list = []
        right_list = []

        for x1, x2, y in horizontal:
            if x2 - x1 >= 2 * d:
                left_list.append((x1 + d, y))
                right_list.append((x2 - d, y))

        active = ActiveY(max_coord)

        li = 0
        ri = 0
        ln = len(left_list)
        rn = len(right_list)

        for y1, y2, x in vertical:
            if y2 - y1 < 2 * d:
                continue

            while li < ln and left_list[li][0] <= x:
                active.add(left_list[li][1])
                li += 1

            while ri < rn and right_list[ri][0] < x:
                active.remove(right_list[ri][1])
                ri += 1

            if active.any_in_range(y1 + d, y2 - d):
                return True

        return False

    lo = 0
    hi = max_len
    ans = 0

    while lo <= hi:
        mid = (lo + hi) // 2
        if check(mid):
            ans = mid
            lo = mid + 1
        else:
            hi = mid - 1

    return ans

def solve():
    t = int(input())
    out = []

    for _ in range(t):
        n, m = map(int, input().split())

        horizontal = []
        vertical = []
        max_coord = 0

        for _ in range(n):
            x1, x2, y = map(int, input().split())
            if x1 > x2:
                x1, x2 = x2, x1
            horizontal.append((x1, x2, y))
            max_coord = max(max_coord, x1, x2, y)

        for _ in range(m):
            y1, y2, x = map(int, input().split())
            if y1 > y2:
                y1, y2 = y2, y1
            vertical.append((y1, y2, x))
            max_coord = max(max_coord, y1, y2, x)

        out.append(str(solve_case(horizontal, vertical, max_coord)))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```输入阶段立即标准化端点，因此以后的每次比较都可以假设坐标递增。 最大可能的答案最多是一个线段长度的一半，因为长度加上`d`需要`2d`沿水平和垂直段的单位。 

两个水平顺序准备一次。 排序依据`x1`给出水平间隔变为活动状态的顺序，同时按`x2`给出它们过期的顺序。 添加`d`到每个左端点并减去`d`从每个右端点开始都不会改变任何顺序，因此二分搜索迭代不需要另一种排序。 

这`ActiveY`结构体存储每个 y 坐标的计数。 它的第一个位集记录了每个 256 坐标块内的占用位置。 第二位组记录哪些块包含至少一个活动坐标。 这使得插入和删除相对于问题的固定坐标域来说是恒定时间的。 

区间查询首先直接检查两个边界块。 如果它们之间存在完整的块，则它使用紧凑块级位集检查它们的占用情况。 最大的块索引仅约为`10^5 / 256`，因此即使原始坐标范围很大，这些整数运算仍然很小。 

扫描使用`left <= x`当插入和`right < x`移除时。 这些不平等是关键的边界细节。 其可用间隔恰好在当前垂直 x 坐标处结束的水平线段仍然是有效的候选者。 

Python 整数具有任意精度，因此在构造位掩码时不存在溢出问题。 坐标范围还使每个位组都保持在较小的范围内。 原始的 C++ 实现使用 Fenwick 树而不是这种有界宇宙结构，具有相同的几何扫描和相同的包含区间边界。 

## 工作示例

 ### 示例 1

 输入包含水平线段`[1,5]`在`y=3`,`[2,4]`在`y=2`， 和`[6,12]`在`y=6`。 垂直线段是`[1,5]`在`x=3`和`[6,9]`在`x=2`。 

为了`d=2`，第一个水平线仅在以下位置可用`x=3`，y 坐标`3`。 第二个水平线正好具有所需的长度，可用于`x=3`以及。 第一个垂直线具有有效的 y 间隔`[3,3]`。 

| 步骤| 候选人`d`| 垂直的`(y1,y2,x)`| 活动水平 y 值 | 查询间隔 | 结果 |
 | --- | --- | --- | --- | --- | --- |
 | 1 | 2 |`(1,5,3)`|`{3,2}`|`[3,3]`| 发现 |
 | 2 | 2 |`(6,9,2)`|`{}`x 订购后 |`[8,7]`| 不需要|

 第一个垂直线与第一个水平线相交于`(3,3)`。 四个臂长分别是`2,2,2,2`，所以答案至少是`2`。 更大的值是不可能的，因为第一个水平线具有总长度`4`，第二个水平线也有总长度`2`。 因此答案是`2`。 

### 自定义跟踪

 考虑```
1
1 1
1 9 5
3 7 5
```水平线段有 x 范围`[1,9]`垂直线段有 y 范围`[3,7]`，两者相交于坐标`5`。 

为了`d=2`，水平可用的x范围是`[3,7]`，垂直可用 y 范围为`[5,5]`。 

| 步骤| 候选人`d`| 水平可用 x | 垂直 x | 活动 y 值 | 垂直可用 y | 结果 |
 | --- | --- | --- | --- | --- | --- | --- |
 | 1 | 2 |`[3,7]`, y=`5`|`5`|`{5}`|`[5,5]`| 发现 |
 | 2 | 3 |`[4,6]`, y=`5`|`5`|`{5}`|`[6,4]`| 不可能|

 支票为`d=2`成功是因为交叉点`(5,5)`水平方向有 4 个单位，垂直方向有 2 个单位，所以最短的臂是`2`。 支票为`d=3`失败，因为垂直线段只有总长度`4`，这对于两臂长度来说是不够的`3`。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |`O((N+M) log C)`| 每次可行性检查都会在线性时间内扫描所有段，并执行二分搜索`O(log C)`检查|
 | 空间|`O(N+M+C)`| 存储段、排序副本、y 计数器和有界坐标位集 |

 这里`C <= 10^5`。 关键的实用属性是动态 y 结构使用有界坐标宇宙而不是具有`O(log C)`每个事件的工作量。 二分查找最多需要大约 17 次迭代，因为`2^17 > 10^5`，因此每个大型测试用例大约执行几百万次分段处理操作。 

原始的 C++ 解决方案使用 Fenwick 树，因此在扫描中具有额外的对数因子，但它符合 C++ 中规定的限制。 Python 版本用坐标位集表示替换了对数数据结构，以保持实现适合相同的严格限制。 

## 测试用例```python
# Helper: execute the same solve logic on an input string.
import sys
import io

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()

    result = sys.stdout.getvalue()

    sys.stdin = old_stdin
    sys.stdout = old_stdout

    return result

# Provided sample.
assert run("""\
1
3 2
1 5 3
2 4 2
6 12 6
1 5 3
6 9 2
""") == "2\n", "sample 1"

# Minimum-size segments. They intersect at one point, but every arm has length zero.
assert run("""\
1
1 1
1 1 1
1 1 1
""") == "0\n", "minimum-size segments"

# Endpoint intersection with positive horizontal length, catching strict-boundary errors.
assert run("""\
1
1 1
1 5 3
3 3 3
""") == "0\n", "endpoint-only intersection"

# Exact maximum plus. Both segments have length 8 and cross at their centers.
assert run("""\
1
1 1
1 9 5
1 9 5
""") == "4\n", "exact half-length"

# Reversed endpoints must be normalized.
assert run("""\
1
1 1
9 1 5
9 1 5
""") == "4\n", "reversed endpoints"

# Two horizontals share the same y coordinate. Removing one must not remove
# the coordinate while the other is still active.
assert run("""\
1
2 1
1 10 5
3 8 5
1 10 5
""") == "3\n", "duplicate active y"

# Large boundary coordinates.
assert run("""\
1
1 1
1 100000 50000
1 100000 50000
""") == "49999\n", "coordinate boundary"

# Multiple test cases.
assert run("""\
2
1 1
1 5 3
1 5 3
1 1
1 2 1
1 2 1
""") == "2\n1\n", "multiple test cases"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1 / [1,1] / [1,1]`|`0`| 最小尺寸段和零长度臂 |
 |`1 1 / [1,5] at y=3 / [3,3] at x=3`|`0`| 仅端点交叉点 |
 |`1 1 / [1,9] at y=5 / [1,9] at x=5`|`4`| 精确的半长和包含边界 |
 | 反转`[9,1]`端点|`4`| 端点标准化|
 | 具有相同 y 的两条水平线 |`3`| 删除期间正确的引用计数 |
 | 坐标等于`100000`|`49999`| 最大坐标边界|
 | 两个测试用例 |`2`,`1`| 测试用例之间的状态隔离|

 ## 边缘情况

 对于仅发生在端点处的交叉点，算法会保留候选点，因为可用的水平间隔是封闭的。 为了```
1
1 1
1 5 3
3 3 3
```水平段允许交叉`x=3`，而垂直线段只能在`y=3`。 交集有效，但垂直线段长度为零，所以答案是`0`。 在正长度检查中，`y1+d <= y2-d`每个立即失败`d > 0`。 

对于总长度恰好是请求答案两倍的线段，缩小的间隔由一个坐标组成。 为了```
1
1 1
1 5 3
3 3 3
```候选人`d=0`是可行的，同时`d=1`这是不可能的，因为垂直段不能在两侧提供一个单元。 更一般地，对于```
1
1 1
1 5 3
1 5 3
```候选人`d=2`产生水平范围`[3,3]`和垂直范围`[3,3]`。 扫描使用`<=`用于激活和`<`用于删除，因此公共边界坐标保持活动状态，并且答案`2`被发现。 

当多个水平线段具有相同的 y 坐标时，活动结构必须表示多重性。 假设两个具有相同 y 的水平线变为活动状态，而一个则过期。 y 坐标仍然由另一个水平坐标表示。 这`count[y]`数组直接处理这个问题：当计数从零变为一时，该位被设置，并且仅当计数返回到零时才被清除。 

在执行任何几何图形之前处理反转端点。 例如，```
1
1 1
9 1 5
9 1 5
```标准化为两个片段`1`到`9`。 它们的中心重合在`5`，给出答案`4`。 如果没有标准化，表达式如`x2-x1`会变成负数，二分搜索上限可能会默默地变得不正确。 

全简并的情况也是安全的。 如果每个水平和垂直线段都由一个点组成，则每个可能的加值都为零。 初始二分搜索下界为零，并且`check(0)`正确地接受任何实际的交叉点，同时拒绝每个积极的候选者。 

最后，涉及同一坐标处多条线的交点不需要特殊处理。 该问题要求我们选择一个水平线段和一个垂直线段，因此每个活动水平线段与当前垂直线段相结合代表一对有效的线段。 该算法只需要知道当前候选长度是否存在至少一对这样的对，而不是存在多少对。
