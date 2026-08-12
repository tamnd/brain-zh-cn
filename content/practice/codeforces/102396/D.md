---
title: "CF 102396D - 切披萨"
description: "我们有一个圆形披萨和（n）个人。 人（i）需要一个角度恰好为（alphai）度的扇形。 这些扇区可以放置在披萨上的任何位置，并且不必出现在输入顺序中。 披萨任何未使用的部分都可以留在盒子里。"
date: "2026-08-11T23:24:11+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102396
codeforces_index: "D"
codeforces_contest_name: "2019-2020 Saint-Petersburg Open High School Programming Contest (SpbKOSHP 19)"
rating: 0
weight: 102396
solve_time_s: 662
verified: true
draft: false
---

[CF 102396D - 切披萨](https://codeforces.com/problemset/problem/102396/D)

 **评级：** -
 **标签：** -
 **求解时间：** 11m 2s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个圆形披萨和（n）个人。 人（i）需要一个角度恰好为（α_i）度的扇形。 这些扇区可以放置在披萨上的任何位置，并且不必出现在输入顺序中。 披萨任何未使用的部分都可以留在盒子里。 

切口可以是半径（创建一条边界射线），也可以是直径（同时创建两条相对的边界射线）。 进行所有切割后，每个请求的扇区必须是生成的扇区之一，没有额外的切割穿过其内部。 任务是最小化切割次数并输出实现该最小值的实际切割集。 官方的例子是(90^\circ)的(4)个副本、(30^\circ)的两个副本和(200^\circ,80^\circ,80^\circ)。 

小界限 (n\le16) 是主要的算法线索。 我们无法枚举所有排列，因为 (16!) 约为 (2.09\cdot10^{13})。 一旦我们还考虑哪些部分属于披萨的相对两半，基于排列的简单搜索就远远超出了一秒限制所能容忍的范围。 预期的解决方案可以提供 (n) 中的指数算法，但它需要 (2^n) 或 (3^n) 左右的时间，而不是阶乘时间。 每个角度都是整数并且整个披萨只有 (360^\circ) 的事实也为我们提供了一个小的角度状态空间，尽管更清晰的解决方案使用子集和而不是 (360) 状态几何 DP。 

有几种边界情况可能会使看似合理的实现变得错误。 例如，(180^\circ) 的单个请求仅需要一个直径。 输入`1 / 180`有答案`1`，因为直径本身就是所要求的半比萨饼的两个边界。 将每个请求的扇区视为需要两个独立的半径切割将输出`2`。 

另一个重要的情况是当总请求角度恰好是 (360^\circ) 时。 为了`3 / 200 80 80`，三个请求的扇区可以连续放置在整个披萨周围。 三个边界光线是(0,200,280)，因此只需要三个半径切割。 始终以 (n+1) 次切割开始的解决方案会错误地将开始和结束视为不同的边界，即使它们在完整旋转后是同一​​光线。 

一个更微妙的情况是`2 / 30 30`。 如果我们将两个 (30^\circ) 扇区彼此相邻放置，则三个半径切割就足够了，但两个直径切割更好。 (0^\circ) 和 (30^\circ) 处的切削直径在 (0\ldots30) 和 (180\ldots210) 处创建 (30^\circ) 扇区。 请求的两个扇区是相反的副本，所以答案是`2`。 这正是纯线性排列所缺少的那种对称性。 

最后，大于 (180^\circ) 的角度可防止在该请求扇区的内部使用任何直径。 例如，在`3 / 200 80 80`，如果扇区与直径交叉，则直径会将切割光线置于 (200^\circ) 扇区内。 由于每个请求的块都必须是一个完整的扇形，内部没有切口，因此大块迫使我们采用仅限半径的结构。 

## 方法

 最直接的强力方法是决定如何在披萨周围排列所请求的扇区，哪些扇区属于由可能的直径创建的两个半圆，以及组之间的边界出现在哪里。 即使我们只枚举两边的排列和二元选择，我们也已经粗略地得到了

 [
 n!,2^n
 ]

 的可能性。 在 (n=16) 时，这大约是 (1.37\cdot10^{18}) 个组合。 检查每个排列还需要构建其边界并计算直径对，因此这种方法根本不可行。 

有用的观察是，我们在构建解决方案时不应该关心各个切割的确切身份。 直径很有用，因为它可以通过一次切割提供两条相对的边界射线。 固定一个直径并称其两条射线为 (0^\circ) 和 (180^\circ)。 然后可以将所请求的扇区分布在两个半圆之间。 在半圆内，可以连续放置多个请求的扇区，它们之间具有任意未使用的间隙。 

假设我们想要两组请求的扇区（直径的每一侧各一组）从同一边界开始并在另一个公共边界结束。 令他们请求的总角度为 (x) 和 (y)。 这两个公共边界之间的间隔必须至少具有 (\max(x,y)) 长度。 如果(x=y)，两组可以简单地连续放置。 如果 (x<y)，如果短边包含至少两个请求的扇区，则较短的边仍然可以触及两个边界，因为我们可以在其扇区之间插入未使用的间隙。 单扇区组不能接触两个端点，除非其角度已经等于间隔长度。 

这给了我们中心组合对象：配对块。 配对块由一个人子集 (U) 组成，该子集分为两个非空子集 (A) 和 (B)，每个半圆一个子集。 其所需长度为

 [
 w(U)=\max\left(\sum_{i\in A}\alpha_i,\sum_{i\in B}\alpha_i\right)。 
]

 当两个组都可以接触块的两端时，分割有效。 由于一组总是有总和 (w(U))，因此只有较小的组需要检查。 如果其总和严格小于 (w(U))，则它必须包含至少两个扇区，以便可以将缺失的角度作为内部间隙插入。 如果两个总和相等，则一个扇区组也可以。 

每个配对的块都为我们提供了两个半圆之间的一个额外的公共边界。 公共边界可以节省一次切割，因为一个直径可以服务于两侧。 成对的块从 (0^\circ) 到 (180^\circ) 连续放置。 

其余请求的扇区不必配对。 放置完所有配对块后，假设它们的总长度为（P）。 每个半圆还剩 (180-P) 度。 剩余扇区必须在两个半圆之间划分，以便分配给每边的总角度最多为该剩余容量。 这只是子集和检查。 

还有一项节省需要处理。 如果一个半圆被精确填充到 (180^\circ)，则其起始光线和结束光线是相反的，实际上是一个直径切割。 因此，开始和结束边界不应单独计算。 同样的想法可以处理完整的 (360^\circ) 仅半径排列。 

因为 (n) 只有 (16)，所以我们可以枚举每个子集并计算该子集的最佳可能配对分割。 然后，子集 DP 将一些人划分为成对的块，同时最小化这些块消耗的总长度。 对于每个配对块的数量，我们保留最小可能消耗的角度。 最后我们测试未配对的人是否可以放入剩余的两个半圆中。 

比较是：

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(n!2^n)) | (O(n)) | (O(n)) | 太慢了|
 | 子集 DP | (O(n3^n)) | (O(n2^n)) | 已接受 |

 ## 算法演练

 1. 计算总请求角度 (S=\sum\alpha_i)。 值 (S) 告诉我们需要占用多少角空间，并立即给出两个半圆的容量要求。 
2. 对于每个子集 (U)，计算其总角度`sum[U]`。 我们还计算一个描述可从 (U) 获得的每个子集和的位集，以及包含可使用至少两个元素获得的和的第二个位集。 
3. 对于至少包含两个人的每个子集 (U)，找到有效分割的最大可能的较小边 (U=A\cup B)。 如果双方的总和相等，则分割立即有效。 否则，较小的一侧必须至少包含两个人，因为它需要一个内部间隙来接触配对块的两端。 
4. 存储生成的块长度和实际分割。 如果较小的边有 sum (t)，则较大的边有 sum`sum[U] - t`，所以该块消耗`sum[U] - t`每个半圆的度数。 
5. 运行子集 DP。 国家`dp[mask][k]`仅使用以下人员存储恰好 (k) 个配对块所占据的最小总长度`mask`。 不包含在其中的人`mask`仍然是免费的，稍后会放置。 
6. 处理掩码时，查看其最不重要的人。 要么让那个人不配对，要么制作一个包含那个人的配对块。 将每个选定的块限制为包含最少的剩余人员，可以为每个分区提供独特的分解，并避免以多种顺序对相同的块集合进行计数。 
7. 对于每个 DP 状态，令占用的配对块长度为 (P)。 每个半圆的剩余容量为(C=180-P)。 当未配对的人中的某些子集之间的总和时，它们可以准确地分布在两侧`remaining_sum - C`和`C`。 它们的子集和位集让我们可以在已知 DP 状态后在恒定时间位操作中对此进行测试。 
8. 在所有可行状态中，最大化配对块的数量（k）。 如果多个状态具有相同的 (k)，则更喜欢半圆可以精确填充到 (180^\circ) 的状态，因为这样它的两个端点光线将被一次直径切割并节省一次切割。 
9. 根据 DP 父指针重建配对块。 对于每个配对块，将其第一组放置在上半圆上，将第二组放置在下半圆上。 两个组都从当前公共边界开始，到下一个公共边界结束。 如果一个组的总长度小于块长度并且它至少包含两个扇区，则将未使用的角度放在其扇区之间。 
10. 将剩余的人放在配对块之后，根据子集和重建将它们分开。 现在，每一侧都适合其剩余 (180^\circ) 容量。 
11. 收集作为扇区边界所需的每条射线。 对于每对相反的光线 (x) 和 (x+180)，如果需要两条光线，则发射一个直径。 否则发射所需射线的半径。 最终的压缩还自动处理 (180^\circ) 和 (360^\circ) 边界情况。 

### 为什么它有效

 每个有用的直径要么创建两个半圆所需的边界，要么标识半圆的两端。 在两个连续的公共边界之间，每一侧的请求扇区形成两组。 它们的总角度决定了公共边界之间的最小可能距离，这正是两组总和的最大值。 较短组的有效性条件取决于它是否可以触及两个端点。 

DP 考虑每个可能的配对组，因为子集的每个有效分割都由其子集 (U) 表示。 它还考虑了不相交配对组的每个可能集合，因为最小设置位循环要么使第一个人不配对，要么将该人放入恰好一个选定的块中。 对于每个数量的块，它都会保持最小占用角度，因此具有相同使用人数和块数的状态无法更好地适应剩余人员。 

固定配对块后，唯一剩下的问题是未使用的扇区是否适合剩余的两个半圆形容量。 子集和检验正是这个条件。 因此，每个可行的几何排列都由某个DP状态表示，并且每个通过容量测试的DP状态都可以被几何构造。 最大化配对块的数量，然后在可用时保存 (180^\circ) 端点，从而最大限度地减少切割次数。 

## Python 解决方案```python
import sys
from array import array

input = sys.stdin.readline

def solve():
    n = int(input())
    a = list(map(int, input().split()))

    N = 1 << n
    ALL = N - 1
    INF = 10**9

    total = [0] * N
    reach = [0] * N
    reach2 = [0] * N
    popcnt = [0] * N

    # Bit i in reach[mask] means that this subset of mask
    # can have total angle i.
    reach[0] = 1

    for mask in range(1, N):
        bit = mask & -mask
        i = bit.bit_length() - 1
        rem = mask ^ bit

        total[mask] = total[rem] + a[i]
        popcnt[mask] = popcnt[rem] + 1

        r = reach[rem]
        reach[mask] = r | (r << a[i])

        # At least two elements:
        # either a >=2-element subset already exists in rem,
        # or we take i together with a nonempty subset of rem.
        nonempty = r & ~1
        reach2[mask] = reach2[rem] | (nonempty << a[i])

    # For each subset U:
    # weight[U] = minimum length of a paired block using U.
    # split[U] = one side of the corresponding split.
    weight = array('H', [0]) * N
    split = array('H', [0]) * N

    for mask in range(1, N):
        if popcnt[mask] < 2:
            continue

        s = total[mask]
        half = s // 2

        # First try a perfectly balanced split.
        if s % 2 == 0 and ((reach[mask] >> half) & 1):
            small = half
            need_two = False
        else:
            # Otherwise the smaller side must contain >= 2 elements.
            limited = reach2[mask] & ((1 << (half + 1)) - 1)
            if not limited:
                continue
            small = limited.bit_length() - 1
            need_two = True

        large = s - small

        # The paired block must fit into a semicircle.
        if large > 180:
            continue

        # Recover an actual subset having sum == small.
        x = mask
        target = small
        side = 0

        while target:
            bit = x & -x
            i = bit.bit_length() - 1
            rem = x ^ bit

            source = reach2[rem] if need_two else reach[rem]

            if (source >> target) & 1:
                x = rem
            else:
                side |= bit
                target -= a[i]
                x = rem

        if side == 0:
            continue

        weight[mask] = large
        split[mask] = side

    # dp[mask][k] = minimum total length of k paired blocks
    # using exactly the people in mask.
    K = n // 2
    W = K + 1

    dp = [None] * N
    dp[0] = [INF] * W
    dp[0][0] = 0

    # choice[mask * W + k] is the paired block used to obtain
    # the state. Zero means that the least significant person
    # was left unpaired.
    choice = array('H', [0]) * (N * W)

    for mask in range(1, N):
        bit = mask & -mask
        without = mask ^ bit

        cur = dp[without][:]

        sub = without
        while sub:
            block = sub | bit
            w = weight[block]

            if w:
                rem = mask ^ block
                prev = dp[rem]

                max_k = min(K - 1, popcnt[rem] // 2)

                for k in range(max_k + 1):
                    old = prev[k]
                    if old == INF:
                        continue

                    nw = old + w
                    if nw < cur[k + 1]:
                        cur[k + 1] = nw
                        choice[mask * W + k + 1] = block

            sub = (sub - 1) & without

        dp[mask] = cur

    # We need enough saving to fit everything into two semicircles.
    required = max(0, total[ALL] - 180)

    best_k = -1
    best_mask = -1
    best_p = INF
    best_e = False
    best_left = 0

    # Try the largest number of paired blocks first.
    for k in range(K, -1, -1):
        found = False
        found_e = False
        candidate = None

        for mask in range(N):
            p = dp[mask][k]
            if p == INF or p > 180:
                continue

            capacity = 180 - p
            rem = ALL ^ mask
            rs = total[rem]

            # The remaining people must be split between the
            # two semicircles, each with capacity 'capacity'.
            low = max(0, rs - capacity)
            high = min(capacity, rs)

            if low > high:
                continue

            bits = reach[rem]
            allowed = bits & ((1 << (high + 1)) - 1)

            if low:
                allowed &= ~((1 << low) - 1)

            if not allowed:
                continue

            # Prefer an exact capacity on one side.
            exact = (
                capacity <= high
                and capacity >= low
                and ((bits >> capacity) & 1)
            )

            if exact and not found_e:
                found_e = True
                candidate = (mask, p, capacity, rem, True)
            elif not found_e and candidate is None:
                target = allowed.bit_length() - 1
                candidate = (mask, p, capacity, rem, False)

            found = True

        if found:
            best_k = k
            best_mask, best_p, capacity, rem, best_e = candidate
            break

    # If no partition into two semicircles exists, no diameter can
    # be used without cutting through a requested sector.
    if best_k == -1:
        need = [False] * 360
        need[0] = True

        cur_angle = 0
        for x in a:
            cur_angle += x
            if cur_angle < 360:
                need[cur_angle] = True

        cuts = []
        for ang in range(180):
            x = need[ang]
            y = need[ang + 180]

            if x and y:
                cuts.append((ang, 1))
            elif x:
                cuts.append((ang, 0))
            elif y:
                cuts.append((ang + 180, 0))

        out = [str(len(cuts))]
        out.extend(f"{ang} {typ}" for ang, typ in cuts)
        sys.stdout.write("\n".join(out))
        return

    # Recover the paired blocks.
    blocks = []
    mask = best_mask
    k = best_k

    while mask:
        block = choice[mask * W + k]

        if block:
            blocks.append((block, split[block]))
            mask ^= block
            k -= 1
        else:
            bit = mask & -mask
            mask ^= bit

    blocks.reverse()

    # Recover the remaining people assigned to one semicircle.
    paired_mask = best_mask
    remaining = ALL ^ paired_mask
    capacity = 180 - best_p

    rs = total[remaining]
    low = max(0, rs - capacity)
    high = min(capacity, rs)

    bits = reach[remaining]

    if best_e and ((bits >> capacity) & 1):
        target = capacity
    else:
        allowed = bits & ((1 << (high + 1)) - 1)
        if low:
            allowed &= ~((1 << low) - 1)
        target = allowed.bit_length() - 1

    top_remaining = 0
    x = remaining
    t = target

    while t:
        bit = x & -x
        i = bit.bit_length() - 1
        rem = x ^ bit

        if (reach[rem] >> t) & 1:
            x = rem
        else:
            top_remaining |= bit
            t -= a[i]
            x = rem

    bottom_remaining = remaining ^ top_remaining

    need = [False] * 360
    need[0] = True

    def place_group(mask, start, length):
        if mask == 0:
            return

        ids = []
        x = mask
        while x:
            bit = x & -x
            ids.append(bit.bit_length() - 1)
            x ^= bit

        cur = start

        for j, i in enumerate(ids):
            if j + 1 == len(ids):
                end = start + length
            else:
                cur += a[i]
                end = cur

            need[end % 360] = True

    pos = 0

    # Paired blocks occupy the same interval in both semicircles.
    for block, side_a in blocks:
        side_b = block ^ side_a

        sa = total[side_a]
        sb = total[side_b]
        length = max(sa, sb)

        place_group(side_a, pos, length)
        place_group(side_b, 180 + pos, length)

        pos += length

    # Place unpaired people after all paired blocks.
    def place_consecutive(mask, start):
        cur = start
        x = mask

        while x:
            bit = x & -x
            i = bit.bit_length() - 1
            cur += a[i]
            need[cur % 360] = True
            x ^= bit

    place_consecutive(top_remaining, pos)
    place_consecutive(bottom_remaining, 180 + pos)

    # Compress opposite required rays into diameter cuts.
    cuts = []

    for ang in range(180):
        x = need[ang]
        y = need[ang + 180]

        if x and y:
            cuts.append((ang, 1))
        elif x:
            cuts.append((ang, 0))
        elif y:
            cuts.append((ang + 180, 0))

    out = [str(len(cuts))]
    out.extend(f"{ang} {typ}" for ang, typ in cuts)
    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```实现的第一部分将子集和构建为用作位集的 Python 整数。 位置（x）处的单个位意味着可以通过从子集中选择一些人来获得角度（x）。 Python 的任意精度整数使这些子集和转换非常紧凑且快速。 

第二个位组，`reach2`，表示至少使用两个人可获得的总和。 对于不相等的配对块来说需要这种区别。 如果一侧有总计 (x)，另一侧有总计 (y>x)，则较短的一侧需要至少两个扇区来接触间隔的两端。 如果只有一个扇区，则它必须具有精确的角度 (y)。 

这`weight`数组存储有效配对块的最小间隔长度。 如果一个子集有total(s)，其较小的边可以有total(t)，较大的边有total(s-t)，所以区间消耗`s - t`度。 选择最大可能的有效 (t) 可以最小化该间隔。 

主要子集 DP 使用最不重要的人作为规范选择。 让那个人不配对会从没有那个人的掩码中复制状态。 否则，包含该人的配对块将被移除，并添加其重量。 这种规范的选择可以防止在每个可能的块顺序中生成相同的块分区。 

在最后阶段，`dp[mask][k]`告诉我们两个半圆中有多少已经被 (k) 个配对块保留。 补体包含所有未配对的人。 子集和位集确定那些剩余扇区是否可以在两个剩余容量之间划分。 

重建精确地反映了 DP。 将一对块放置在两个半圆上相同的角度间隔处。 如果一侧的请求角度小于间隔长度，则实现将未使用的角度紧邻最后一个扇区之前。 这保证了该组的第一条和最后一条射线仍然是实际请求的扇区边界。 

决赛`need`阵列被故意构造为一组光线，而不是直接发射切口。 这避免了 (0^\circ)、(180^\circ) 和 (360^\circ) 周围的脆弱特殊情况。 一旦知道了所有所需的光线，每一对对映体自然就可以用一个直径来表示。 

Python整数在这里不会溢出，最大的子集和只有(360)。 需要注意的主要实现细节是角度模 (360) 与两条不同射线 (0^\circ) 和 (360^\circ) 之间的区别。 它们是相同的射线，因此代码始终存储角度模 (360)。 

## 工作示例

 ### 示例 1

 输入是：```
4
90 90 90 90
```我们可以将四个请求分成两个配对的块。 每个块的每一侧都包含一个 (90^\circ) 扇区，因此每个块的长度为 (90^\circ)。 这两个块占据了整个 (180^\circ) 半圆。 

| 步骤| 配对块| 总和上限| 降低总和| 块长度| 职位|
 | --- | --- | --- | --- | --- | --- |
 | 1 | 90 / 90 | 90 / 90 90 | 90 90 | 90 90 | 90 0 -> 90 | 0 -> 90 |
 | 2 | 90 / 90 | 90 / 90 90 | 90 90 | 90 90 | 90 90 -> 180 |

 所需射线为 (0^\circ,90^\circ,180^\circ,270^\circ)。 (0/180) 和 (90/270) 是对映体，因此每一对变成一个直径。 

因此，输出包含两次剪切，例如：```
2
0 1
90 1
```这表明了两种节约来源。 每个成对的块给出一个共同的边界，并且因为整个半圆达到(180^\circ)，所以该半圆的两个端点是一个直径。 

### 示例 2

 输入是：```
2
30 30
```这两个请求形成一对块。 

| 步骤| 配对块| 总和上限| 降低总和| 块长度| 职位|
 | --- | --- | --- | --- | --- | --- |
 | 1 | 30 / 30 | 30| 30| 30| 0 -> 30 | 0 -> 30 |

 这两个扇区位于 (0\ldots30) 和 (180\ldots210)。 所需射线为 (0^\circ,30^\circ,180^\circ,210^\circ)。 

| 雷对| 必需的？ | 切|
 | --- | --- | --- |
 | 0 和 180 | 两者 | 0 处的直径 |
 | 30 和 210 | 两者 | 直径 30 |

 因此两次切割就足够了。 

此示例说明了为什么仅仅连续排列请求是不够的。 连续放置将使用射线 (0,30,60)，需要三次切割。 将请求拆分到相对的半圆之间会创建一个额外的共享边界，并将答案减少到两个。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(n3^n)) | 子集 DP 考虑包含规范最小元素的子掩码，具有最多 (O(n)) 块计数状态。 |
 | 空间| (O(n2^n)) | 为所有掩码存储 DP 状态、子集和位组以及重构信息。 |

 对于 (n\le16)，(2^n=65536)，因此指数状态空间对于预期的解决方案来说足够小。 子集和运算特别有效，因为它们使用 Python 整数作为位集。 (3^n) 转换界限是主导运行时间的部分，但是 (3^{16}=43,046,721)，这对于紧凑子集表示和按可能配对块的数量进行修剪是实用的。 

## 测试用例

 以下测试验证生成的切割，而不是比较程序打印的精确角度，因为该问题允许任何最佳构造。```python
# Save the submitted solution as solution.py before running this file.

import subprocess

def run(inp: str) -> str:
    p = subprocess.run(
        ["python3", "solution.py"],
        input=inp,
        text=True,
        capture_output=True,
        check=True,
    )
    return p.stdout

def validate(inp: str, out: str, expected_min_cuts: int):
    data = list(map(int, inp.split()))
    n = data[0]
    a = data[1:1 + n]

    lines = out.strip().splitlines()
    m = int(lines[0])

    assert m == len(lines) - 1
    assert m == expected_min_cuts

    rays = set()

    for line in lines[1:]:
        angle, typ = map(int, line.split())
        assert 0 <= angle < 360
        assert typ in (0, 1)

        rays.add(angle)

        if typ == 1:
            rays.add((angle + 180) % 360)

    rays = sorted(rays)
    assert rays

    sectors = []
    for i in range(len(rays)):
        x = rays[i]
        y = rays[(i + 1) % len(rays)]
        if i + 1 == len(rays):
            y += 360
        sectors.append(y - x)

    sectors.sort()

    wanted = sorted(a)

    # Every requested sector must occur as a complete atomic sector.
    i = 0
    j = 0
    while i < len(wanted) and j < len(sectors):
        if wanted[i] == sectors[j]:
            i += 1
        j += 1

    assert i == len(wanted)

# Sample 1
sample1 = """\
4
90 90 90 90
"""
out = run(sample1)
validate(sample1, out, 2)

# Sample 2
sample2 = """\
2
30 30
"""
out = run(sample2)
validate(sample2, out, 2)

# Sample 3
sample3 = """\
3
200 80 80
"""
out = run(sample3)
validate(sample3, out, 3)

# Minimum-size input: one 180-degree sector is exactly one diameter.
case4 = """\
1
180
"""
out = run(case4)
validate(case4, out, 1)

# All equal values. Eight opposite pairs of 1-degree sectors
# require nine distinct boundary positions.
case5 = """\
16
1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
"""
out = run(case5)
validate(case5, out, 9)

# Boundary case: the requested sectors fill exactly one semicircle.
case6 = """\
3
60 60 60
"""
out = run(case6)
validate(case6, out, 3)

# A 180-degree subset can be made into one side of a diameter,
# reducing the number of radius cuts.
case7 = """\
3
100 80 50
"""
out = run(case7)
validate(case7, out, 3)
```定制案例涵盖了重要的结构边界：

 | 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / 180`|`1`| 半个披萨是按直径切割的。 |
 |`16 / sixteen 1s`|`9`| 最大值 (n)、许多配对块和重复的等角。 |
 |`3 / 60 60 60`|`3`| 精确的 (180^\circ) 总数和端点识别情况。 |
 |`3 / 100 80 50`|`3`| 即使没有两个对称组，(180^\circ) 子集也可以创建有用的直径。 |

 ## 边缘情况

 对于单个 (180^\circ) 请求，输入为：```
1
180
```该构造将扇区放置在 (0^\circ) 到 (180^\circ) 之间。 两条射线属于相同的直径，因此最终压缩会看到所需的射线对 (0/180) 并发出一个直径。 输出正好有一次剪切。 

对于完整的 (360^\circ) 排列，请考虑：```
3
200 80 80
```没有直径可以安全地超过 (200^\circ) 要求，因此解决方案退回到连续半径切割。 边界为 (0,200,280)，在最后一个 (80^\circ) 扇区之后，角度返回到 (360^\circ=0^\circ)。 第一个和最后一个边界是相同的射线，正好给出三个切口。 

对于重复的相同请求，请考虑：```
2
30 30
```DP 找到一对包含两个人的块，分割为 (30/30)。 它的长度是(30^\circ)。 这些扇区的位置从 (0) 到 (30) 以及从 (180) 到 (210)。 两个边界对都是对映的，因此所需的两个切割是 (0^\circ) 和 (30^\circ) 处的直径。 

对于不太明显的情况：```
3
100 80 50
```(100^\circ)和(80^\circ)扇区可以占据一个完整的半圆，从(0^\circ)到(180^\circ)。 (50^\circ)扇区占据另一个半圆的(180^\circ)到(230^\circ)。 所需的光线为 (0^\circ,100^\circ,180^\circ,230^\circ)。 由于 (0^\circ) 和 (180^\circ) 相反，因此一个直径代替了两个半径切割。 最终的答案是三刀切。 

DP 通过最后的两个半圆分区来处理最后一种情况，而不是要求成对块 DP 制造一对对称的请求扇区。 这种区别很重要，因为直径可以在另一侧创建额外的边界。 只要额外的切割不穿过所请求的扇区，相反的射线不必是另一个所请求的扇区的端点。 

对于具有 16 个相等 (1^\circ) 请求的最大大小实例，DP 可以创建八个配对块。 每对在相对的半圆上占据一个度数，在 (0,1,\ldots,8) 处产生公共边界。 需要九个直径切割。 每边剩余的 (172^\circ) 根本没有使用，因此不需要额外的切割。
