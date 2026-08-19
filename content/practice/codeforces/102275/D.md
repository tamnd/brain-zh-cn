---
title: "CF 102275D - 海鲜"
description: "珀西从数轴上的位置 0 开始。 每个物体都有位置、硬度和类型。 当珀西到达蛤蜊的位置时，可以捡起它。 岩石可以打破当前携带的所有蛤，其硬度严格小于岩石的硬度。"
date: "2026-08-17T03:12:09+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102275
codeforces_index: "D"
codeforces_contest_name: "2019 Facebook Hacker Cup, Round 2"
rating: 0
weight: 102275
solve_time_s: 755
verified: true
draft: false
---

[CF 102275D - 海鲜](https://codeforces.com/problemset/problem/102275/D)

 **评级：** -
 **标签：** -
 **求解时间：** 12m 35s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 珀西从数轴上的位置 0 开始。 每个物体都有位置、硬度和类型。 当珀西到达蛤蜊的位置时，可以捡起它。 岩石可以打破当前携带的所有蛤，其硬度严格小于岩石的硬度。 

运动本身是唯一需要花费时间的事情。 珀西可能会多次经过一个物体，并且重新访问一块岩石很有用，因为一块岩石可以打破在该岩石先前访问后拾起的蛤蜊。 任务是找出吃掉每只蛤所需的最小总游泳距离，或报告`-1`如果某个蛤永远无法被打破。 

位置和硬度是由两个二阶递归生成的，因此我们首先必须构造实际的对象。 在乘法过程中，重复值可以超过 32 位范围，这在 Python 中是无害的，因为整数具有任意精度。 

由于一个测试用例中有多达 800,000 个对象，将每个蛤蜊与每块岩石进行比较的算法已经太慢了。 在最坏的情况下，二次算法将执行大约 6.4 × 10^11 次比较。 预期的解决方案需要接近线性或 O(N log N)，包括所需的排序，因为生成的对象不是按位置顺序给出的。 

第一个微妙的情况是严格的硬度。 考虑```
2
1 2 0 0 0 10
5 5 0 0 0 10
CR
```蛤和岩石的硬度都是5，所以岩石无法击碎蛤。 答案是`-1`。 解决方案使用`>=`而不是`>`会错误地报告有限答案。 

第二个微妙的情况是，全球最坚硬的岩石不一定有足够的用途来提供最短路线。 例如，```
3
9 10 0 0 99 100
6 5 0 0 5 10
RCR
```这些物体是硬度为 6 的岩石（硬度为 9）、硬度为 5 的蛤蜊（硬度为 10）和硬度为 6（硬度为 100）的岩石。珀西可以游到硬度为 10 的地方，将 1 个单位返回到硬度为 9 的岩石上，然后完成，需要 11 秒。 一路走到第100名就更糟糕了。 总是选择全球最坚硬的岩石的解决方案错过了这种可能性。 

第三个微妙的情况是，在蛤蜊之前访问的岩石不会仅仅因为珀西后来经过蛤蜊而打破该蛤蜊。 在```
4
10 50 0 1 40 80
50 10 0 1 38 80
RRCC
```物体的硬度为 50 的岩石为 10，硬度为 10 的岩石为 50，硬度为 49 的蛤蜊为 11，硬度为 8 的蛤蜊为 52。最佳路线是```
0 -> 11 -> 10 -> 50 -> 52 -> 50
```成本为 56。第一个蛤在位置 10 处破裂，而第二个蛤在拾取后在位置 50 处破裂。 简单地访问每个对象一次的粗心方法会失败，因为在第一次访问 50 处的岩石后，第二个蛤会被拾起。 

最后，生成的位置没有排序，并且可能非常大。 在进行任何几何推理之前必须按位置排序。 使用生成索引作为空间顺序会产生不正确的优先关系。 

## 方法

 直接的蛮力解决方案可以为每个蛤尝试所有可能的岩石。 对于位置上的蛤蜊`p`和硬度`h`，我们可以检查每块岩石，检查其硬度是否大于`h`，然后尝试推理生成的路线。 在最坏的情况下，即使只是为每个蛤找到一个可能的破碎机也需要 O(N²)。 对于 800,000 个对象，这是完全不可行的。 

更有用的强力方法是枚举珀西实际用来打破蛤蜊的岩石，然后找到该选择的最短路线。 这仍然是指数级的，因为每个蛤都有可能选择两侧的一块岩石，并且几个蛤可能共享一块岩石。 

关键的观察是珀西总是从左到右发现新的位置。 所有位置都是正数，因此当他第一次到达新的最大位置时，较小位置的每个对象都已被访问过。 复杂的部分只是重新审视岩石。 

想想珀西实际打破蛤蜊的岩石。 我们可以标准化一个最佳解决方案，以便这些服务岩石以递增的位置顺序出现。 假设两个连续的服务岩石以递减的位置顺序出现。 设他们的硬度为`a`和`b`。 如果`a >= b`，第一块石头也能打碎第二块石头打碎的所有蛤蜊。 如果`b > a`，第二块石头也能打碎第一块石头打碎的所有蛤蜊。 在任何一种情况下，两个服务事件中的一个都是不必要的。 重复此操作可消除所有减少。 

现在在位置上连续取两个服务岩石`L < R`。 它们之间的每一个蛤蜊都可以被打破`L`，珀西返回后，或者通过`R`，而珀西向右移动。 不需要非相邻的服务岩石。 如果蛤需要更早的岩石而不是`L`，那么早期的岩石比`L`，并且它可以取代`L`对于之前提供的蛤蜊`L`以及。 同样的论点也适用于后来的摇滚乐。 

这将运动问题转化为以递增位置顺序对岩石进行动态规划问题。 

假设之前的服务岩石是`L`新的服务岩石是`R`。 如果每只蛤蜊`(L,R)`硬度小于`H_R`，珀西只是从`L`到`R`, 成本核算`R-L`。 

否则，有些蛤蜊太硬了`R`。 自从`L`必须能够为他们服务，每一个蛤蜊`(L,R)`硬度必须小于`H_L`。 让`q`成为最右边的蛤`(L,R)`其硬度至少为`H_R`。 珀西可以从`L`到`q`，返回到`L`打破所有蛤蜊`L`可以打破，然后继续`R`。 成本是`(q-L) + (q-L) + (R-q) = R + 2q - 3L`。 

有一种特别有用的方法可以识别以前的岩石是否`L`可以执行第二种类型的转换。 让`bad[L]`严格位于右侧的第一个蛤蜊`L`其硬度至少为`H_L`。 然后`L`可以处理直到新岩石的整个区间`R`恰好在什么时候`R < bad[L]`。 

这给出了具有两种候选值的递归。 对于正常的过渡，我们需要`dp[L] - L`。 

对于涉及返回到的转换`L`，我们需要`dp[L] - 3L`。 

第一个值永远不会过期。 第二个值仅在以下情况下可用`R < bad[L]`。 芬威克树处理第一种类型的后缀最小值，而线段树加上到期堆处理第二种类型的前缀最小值。 

剩下的几何查询就是之前最右边的蛤`R`其硬度至少为`H_R`。 这正是单调堆栈查询。 相同类型的栈，从右向左扫描，计算`bad[L]`。 

最终的方法是 O(N log N)，主要由排序和范围最小数据结构决定。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(N²) | O(N) | 太慢了 |
 | 最佳| O(N log N) | O(N log N) | O(N) | 已接受 |

 ## 算法演练

 1. 从两个重复生成所有位置和硬度。 将每个对象存储为`(position, hardness, type)`并按位置对对象进行排序。 位置顺序是珀西第一次遇到物体的顺序。 
2. 使用包含蛤位置和硬度的单调堆栈从右到左扫描已排序的对象。 对于每块岩石，删除硬度小于岩石的堆叠条目。 剩下的顶部是最右边的蛤，其硬度至少是岩石的硬度。 将其位置存储为`bad[L]`。 如果栈变空，`bad[L]`是无穷大。 
3. 在相同的从右到左扫描过程中，保持每块岩石右侧所有蛤的最大硬度。 当该最大值严格小于其硬度时，岩石就是可能的最终使用岩石。 存储该条件以获得最终答案。 
4. 用另一堆单调的蛤蜊从左到右扫描已排序的物体。 当坚硬的岩石`H_R`遇到硬度小于的爆蛤`H_R`。 这些弹出之后的顶部是最靠近左侧的蛤，硬度至少`H_R`。 呼叫其位置`q`。 如果不存在这样的蛤，则设置`q = 0`。 
5. 通过动态规划以递增的位置顺序处理岩石。 让`dp[R]`是到达岩石所需的最短游泳距离`R`毕竟之前的蛤蜊`R`已经被吃掉了。 
6. 如果`q = 0`，位置 0 处的虚拟起点可以直接过渡到`R`，因为每一个蛤蜊之前`R`比`R`。 这给出了候选人成本`R`。 
7. 真正的前摇滚`L`和`L >= q`，里面没有蛤蜊`(L,R)`其硬度达到`H_R`。 岩石`R`当珀西向右移动时，可以打破该间隔内的所有蛤蜊。 过渡是`dp[L] + R-L`，所以数据结构存储`dp[L]-L`。 
8. 真正的前摇滚`L < q`，蛤蜊在`q`和之间的所有其他蛤蜊`L`和`R`必须由`L`， 因为`R`不能打破蛤蜊`q`。 此转换仅在以下情况下有效`R < bad[L]`。 其成本为`dp[L] + R + 2q - 3L`，所以数据结构存储`dp[L]-3L`。 
9、查询之前岩石中至少在该位置处的最小法向转变值`q`，以及以下位置先前岩石中的最小返回转变值`q`。 将它们与当前位置结合起来`q`获得`dp[R]`。 
10. 将新岩石插入到两个数据结构中。 它的正常转换值始终可用。 仅当以下情况时才插入其返回转换值：`bad[R]`严格大于当前位置，并且一旦扫描到达就将其删除`bad[R]`。 
11. 处理完所有岩石后，选择最后一个服务岩石`L`。 如果右侧每个蛤的硬度都小于`H_L`，珀西可以通过移动到最右边的蛤并返回来完成`L`。 这需要花费`2(Cmax-L)`什么时候`L < Cmax`，当最后一个蛤蜊已经位于或左侧时为零`L`。 取所有有效最终岩石中的最小值。 

### 为什么它有效

 不变量是加工岩石后`R`,`dp[R]`是最新服务岩石为的所有标准化航线中成本最低的`R`其首次访问已达到`R`。 两个连续的服务岩石之间`L<R`，每个蛤都由`R`向右运动或通过`L`在一次回程旅行期间。 如果`R`处理一切，成本是`R-L`。 否则`q`是最右边的蛤`R`无法处理，并且`L`必须处理整个间隔，给出准确的成本`R+2q-3L`。 条件`R<bad[L]`正是条件是`L`比区间内的所有蛤蜊都硬。 由于每条归一化的最佳路线都可以表示为这种不断增加的服务岩石，因此 DP 会考虑每一种最佳可能性，并且不接受无效的转换。 

## Python 解决方案```python
import sys
import heapq
from bisect import bisect_left

input = sys.stdin.readline

INF = 10**30

def solve():
    T = int(input())
    out = []

    for tc in range(1, T + 1):
        n = int(input())

        p1, p2, ap, bp, cp, dp_mod = map(int, input().split())
        h1, h2, ah, bh, ch, dh_mod = map(int, input().split())
        ops = input().strip()

        objects = [(p1, h1, ops[0] == 'C'),
                   (p2, h2, ops[1] == 'C')]

        pp, p = p1, p2
        hh, h = h1, h2

        for i in range(2, n):
            np = ((ap * pp + bp * p + cp) % dp_mod) + 1
            nh = ((ah * hh + bh * h + ch) % dh_mod) + 1
            objects.append((np, nh, ops[i] == 'C'))
            pp, p = p, np
            hh, h = h, nh

        objects.sort()

        # For every rock, compute:
        # bad = first clam to the right with hardness >= rock hardness
        # final_ok = every clam to the right is strictly easier
        rock_rev = []
        stack = []
        suffix_max_clam = -1

        for pos, hard, is_clam in reversed(objects):
            if is_clam:
                stack.append((pos, hard))
                if hard > suffix_max_clam:
                    suffix_max_clam = hard
            else:
                while stack and stack[-1][1] < hard:
                    stack.pop()

                bad = stack[-1][0] if stack else INF
                final_ok = suffix_max_clam < hard
                rock_rev.append((pos, hard, bad, final_ok))

        rock_rev.reverse()
        rocks = rock_rev
        m = len(rocks)

        if m == 0:
            out.append(f"Case #{tc}: -1")
            continue

        # q[i] = nearest clam to the left of rock i
        # whose hardness is >= hardness of rock i.
        q = []
        stack = []

        for pos, hard, is_clam in objects:
            if is_clam:
                stack.append((pos, hard))
            else:
                while stack and stack[-1][1] < hard:
                    stack.pop()
                q.append(stack[-1][0] if stack else 0)

        positions = [r[0] for r in rocks]
        max_clam_pos = -1

        for pos, hard, is_clam in objects:
            if is_clam:
                max_clam_pos = pos

        # Fenwick tree for minimum dp[L] - pos[L].
        # Indexes are reversed so a suffix in position order becomes
        # a prefix query in the Fenwick tree.
        bit = [INF] * (m + 1)

        def bit_update(idx, value):
            while idx <= m:
                if value < bit[idx]:
                    bit[idx] = value
                idx += idx & -idx

        def bit_query(k):
            res = INF
            while k > 0:
                if bit[k] < res:
                    res = bit[k]
                k -= k & -k
            return res

        # Segment tree for minimum dp[L] - 3*pos[L] among active
        # return-transition candidates.
        size = 1
        while size < m:
            size <<= 1

        seg = [INF] * (2 * size)

        def seg_set(idx, value):
            p = idx + size
            seg[p] = value
            p >>= 1
            while p:
                nv = seg[p << 1]
                rv = seg[p << 1 | 1]
                seg[p] = nv if nv < rv else rv
                p >>= 1

        def seg_query(k):
            # Minimum over indexes [0, k).
            if k <= 0:
                return INF

            left = size
            right = size + k
            res = INF

            while left < right:
                if left & 1:
                    if seg[left] < res:
                        res = seg[left]
                    left += 1
                if right & 1:
                    right -= 1
                    if seg[right] < res:
                        res = seg[right]
                left >>= 1
                right >>= 1

            return res

        # (expiry_position, rock_index)
        expiry = []

        dp_values = [INF] * m
        answer = INF

        for i in range(m):
            pos, hard, bad, final_ok = rocks[i]
            qi = q[i]

            # Return-transition candidates with bad <= pos are no longer valid.
            while expiry and expiry[0][0] <= pos:
                _, idx = heapq.heappop(expiry)
                seg_set(idx, INF)

            if qi == 0:
                best = pos
            else:
                k = bisect_left(positions, qi)
                best = pos + bit_query(m - k)

                # Previous rocks strictly to the left of q.
                left_best = seg_query(k)
                if left_best < INF:
                    candidate = pos + 2 * qi + left_best
                    if candidate < best:
                        best = candidate

            dp_values[i] = best

            # Insert current rock as a future previous service rock.
            rev_index = m - i
            bit_update(rev_index, best - pos)

            if bad > pos:
                seg_set(i, best - 3 * pos)
                heapq.heappush(expiry, (bad, i))

            # Can this rock be the last service rock?
            if final_ok:
                if pos >= max_clam_pos:
                    candidate = best
                else:
                    candidate = best + 2 * (max_clam_pos - pos)

                if candidate < answer:
                    answer = candidate

        if answer >= INF:
            answer = -1

        out.append(f"Case #{tc}: {answer}")

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```实现的第一部分构造生成的数组，同时仅保留前两个重复值。 Python 的任意精度整数直接处理大型中间产品。 

排序后，反向扫描计算`bad`以及成为最终服役岩石的条件。 单调堆栈仅包含蛤。 当堆栈顶部太软时弹出，留下最近的蛤，其硬度足以击败当前的岩石。 

前向扫描执行对称查询`q`。 两次扫描是分开的，因为一次扫描要求右侧最近的合格蛤，另一个扫描要求左侧最近的合格蛤。 

芬威克树商店`dp[L] - P_L`。 它的索引是相反的，因为递归需要在岩石上具有最小后缀`P_L >= q`。 Fenwick 树仅接收递减的最小更新，因此不需要删除那里。 

线段树存储`dp[L] - 3P_L`。 这些候选人是临时的。 一旦扫描达到`bad[L]`， 岩石`L`无法再处理以当前岩石结束的间隙中的每个蛤，因此候选者被删除。 堆准确地告诉我们每个候选者何时到期。 

严格的比较是经过深思熟虑的。 坚硬的岩石`h`只能打破硬度严格低于以下的蛤`h`，所以蛤的硬度等于`h`属于阻塞集并导致`bad`事件。 

最终的计算也使用了严格的不等式。 最后一块坚硬的岩石`h`仅当剩余的所有蛤的硬度小于`h`。 

## 工作示例

 ### 示例 1

 这些物体是位置 5 处硬度为 30 的蛤蜊和位置 10 处硬度为 31 的岩石。 

| 位置 | 类型 | 硬度|`q`|`dp`| 行动|
 | --- | --- | --- | --- | --- | --- |
 | 5 | C | 30| | | 捡起蛤蜊|
 | 10 | 10 右 | 31 | 0 | 10 | 10 岩石向右移动时抓住蛤蜊 |

 10 处的岩石在其左侧没有合格的蛤，因为蛤硬度 30 小于 31。虚拟起点可以直接过渡到它，给出`dp = 10`。 岩石后没有蛤，因此它也是有效的最终服务岩石。 答案是`10`。 

### 示例 2

 现在岩石位于位置 5，硬度为 31，蛤蜊位于位置 10，硬度为 30。 

| 位置 | 类型 | 硬度|`q`|`dp`| 行动|
 | --- | --- | --- | --- | --- | --- |
 | 5 | 右 | 31 | 0 | 5 | 到达岩石 |
 | 10 | 10 C | 30| | | 捡起蛤蜊|
 | 5 | 右 | 31 | | | 返回并打破蛤蜊 |

 5 处的岩石成为最后的服务岩石。 它的硬度超过了蛤的硬度，因此在达到 10 的蛤之后，珀西从 10 返回到 5。额外的最终距离为`2(10-5) = 10`, 给予`5 + 10 = 15`。 

该跟踪演示了为什么最终的服务转换与普通转换不同。 珀西在最后一次服务后不需要再次返回，因此从最远的剩余蛤蜊到最后的岩石只需要一次回程。 

### 示例 4

 对象是

 | 位置 | 类型 | 硬度|
 | --- | --- | --- |
 | 10 | 10 右 | 50 | 50
 | 11 | 11 C | 49 | 49
 | 50 | 50 右 | 10 | 10
 | 52 | 52 C | 8 |

 对于岩石 10，其右侧没有更硬或同等的蛤，因为 11 处的蛤的硬度为 49。可以直接以成本 10 到达第一块岩石。 

对于岩石 50，其左侧最近的硬度至少为 10 的蛤是硬度为 11 的蛤，因此`q = 11`。 10 处的前一块岩石位于`q`，其硬度 50 超过位置 10 和 50 之间的每个蛤。返回过渡成本`50 + 2*11 + (dp[10] - 3*10) = 50 + 22 + 10 - 30 = 52`。 

这对应于```
0 -> 11 -> 10 -> 50
```成本为 52。 52 处剩余的蛤的硬度为 8，50 处的岩石可以破碎。 由于这是最后的服务岩石，珀西从 52 返回到 50，加上 4。最终答案是 56。 

这个例子说明了为什么 DP 需要两种转换形式。 穿过岩石的简单最短路径无法捕捉到必须在返回岩石 10 之前拾取 11 处的蛤这一事实。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(N log N) | O(N log N) | 排序成本为 O(N log N)，而单调堆栈、Fenwick 树、线段树和过期堆执行的总工作量为 O(N log N) |
 | 空间| O(N) | 排序后的物体、岩石信息、堆栈、DP值、数据结构都使用线性内存|

 主要操作是按位置对生成的对象进行排序。 此后，每个物体最多进入和离开每个单调堆栈一次，并且每个岩石仅引起恒定数量的对数数据结构操作。 对于 800,000 个对象，这是给定约束的适当规模，而二次替代方案远远超出了可用的操作预算。 

## 测试用例

 下面的测试工具假设提交的解决方案保存为`solution.py`并暴露了`solve()`函数如上所示。```python
import sys
import io

from solution import solve

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        solve()
        return sys.stdout.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

sample = """\
6
2
5 10 0 0 0 50
30 31 0 0 0 50
CR
2
5 10 0 0 0 50
31 30 0 0 0 50
RC
2
5 10 0 0 0 50
30 30 0 0 0 50
RC
4
10 50 0 1 40 80
50 10 0 1 38 80
RRCC
20
415 711 3 4 3 967
9 2 1 2 9 13
CCCCCRRRCRCCCRRCRRCC
100
168981242 670860915 208968638 604295408 490937286 715757945
627165633 146096256 952913201 456337362 978266551 970054933
CRCCRRRRRRRRCRRCCCRCCRRRRCRCRRRRCCCCRCCRRRCRRRCCCCRCCRCCRCRCCCCCRRCCCRRCRRRRCCCRCRRCRRRRCCCRRCRCCCCC RR
"""

# The six official sample answers are:
# 10, 15, -1, 56, 1099, 890508817.
# The long Case 6 operation string above is split only for readability;
# when using it as an executable literal, remove the space before RR.
#
# The first five cases can be checked independently with the following input.

sample_first_five = """\
5
2
5 10 0 0 0 50
30 31 0 0 0 50
CR
2
5 10 0 0 0 50
31 30 0 0 0 50
RC
2
5 10 0 0 0 50
30 30 0 0 0 50
RC
4
10 50 0 1 40 80
50 10 0 1 38 80
RRCC
20
415 711 3 4 3 967
9 2 1 2 9 13
CCCCCRRRCRCCCRRCRRCC
"""

assert run(sample_first_five) == (
    "Case #1: 10\n"
    "Case #2: 15\n"
    "Case #3: -1\n"
    "Case #4: 56\n"
    "Case #5: 1099"
), "official sample cases 1 through 5"

assert run("""\
1
2
1 2 0 0 0 10
5 5 0 0 0 10
CR
""") == "Case #1: -1", "equal hardness is not sufficient"

assert run("""\
1
3
9 10 0 0 99 100
6 5 0 0 5 10
RCR
""") == "Case #1: 11", "a nearby left rock can beat a far right rock"

assert run("""\
1
3
9 10 0 0 10 11
5 5 0 0 5 10
RCR
""") == "Case #1: 11", "strict inequality and right-side boundary"

n = 800000
large_input = (
    "1\n"
    f"{n}\n"
    f"1 2 0 1 0 {n}\n"
    "1 2 0 1 0 2\n"
    + "CR" * (n // 2)
    + "\n"
)

assert run(large_input) == "Case #1: 800000", "maximum-size linear sweep"
```最大尺寸测试使用位置`1,2,...,800000`以及交替的蛤和岩石物体。 每个蛤蜊的硬度为 1，紧接着就是硬度为 2 的岩石，因此最佳路线就是游到最终位置。 

| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`N=2`，蛤和岩石的硬度相同|`-1`| 严格的硬度比较|
 |`RCR`9 和 100 处有岩石 |`11`| 选择附近的左侧服务岩石而不是最右侧的岩石 |
 |`RCR`硬度为 5、5、6 |`11`| 平等不会打破蛤蜊，而严格的坚硬的岩石却可以|
 |`N=800000`, 交替`CR`|`800000`| 最大输入大小、递归生成、排序和 O(N log N) 数据结构 |

 ## 边缘情况

 为了获得相同的硬度，单调堆叠故意保留硬度与当前岩石相同的蛤。 在输入中```
2
1 2 0 0 0 10
5 5 0 0 0 10
CR
```岩石的硬度并不严格大于蛤的硬度。 岩石不能为蛤蜊服务，`final_ok`是假的，并且不存在其他岩石，所以答案是`-1`。 

对于附近的左岩石与远处的右岩石，请考虑```
3
9 10 0 0 99 100
6 5 0 0 5 10
RCR
```生成的位置为 9、10 和 100。9 处的岩石硬度为 6，10 处的蛤蜊硬度为 5。DP 可以使用虚拟起点到达岩石 9，然后最终过渡从 10 处的蛤蜊返回到岩石 9。其成本为`9 + 2(10-9) = 11`。 100 处的远处岩石与最佳值无关。 

对于在后来的蛤之前访问过的岩石，最终的转变明确地解释了返回。 在示例的第四个案例中，在 Percy 在 52 处拿起蛤蜊之前，已经到达了 50 号岩石，因此在第一次访问时不能认为蛤蜊被吃掉。 最终计算加上`2(52-50)=4`，在岩石 10 的早期服务之后产生总答案 56。 

对于较大的生成值，在应用模数之前使用 Python 整数评估递推式。 该代码从不将中间产品转换为 32 位值。 然后，排序步骤建立独立于递归生成对象的顺序的实际空间顺序。 

对于右侧没有足够坚硬的蛤的岩石，`bad`变为无穷大。 它的返回转换候选者永远不会过期，因为它仍然能够处理每个以后的间隔。 相反，如果`bad[L]`是真实的蛤位置，扫描到达该位置后候选对象就会被删除，符合区间内每个蛤的硬度必须低于的严格要求`H_L`。 

最后的服务岩石与普通过渡分开处理，因为珀西不需要在吃掉最后一个蛤之后返回到右侧。 如果最后一块石头是在`L`剩下最远的蛤蜊位于`C`，所需距离为`2(C-L)`， 不是`2(C-L)+(C-L)`。 这种区别使得样本的最终成本为 56，而不是更大的值。
