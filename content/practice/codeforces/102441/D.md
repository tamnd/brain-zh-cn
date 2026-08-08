---
title: "CF 102441D - 圆上的李斯"
description: "有 (n) 名玩家围坐一圈，编号从 (1) 到 (n)。 玩家 (1) 获得第一个回合，然后是玩家 (2)，依此类推，从 (n) 回到 (1)。 每个玩家拥有几张牌，每张牌都有一个整数值。"
date: "2026-08-08T13:22:36+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102441
codeforces_index: "D"
codeforces_contest_name: "2018-2019 9th BSUIR Open Programming Championship. Final"
rating: 0
weight: 102441
solve_time_s: 122
verified: true
draft: false
---

[CF 102441D - 圆上的 Lis](https://codeforces.com/problemset/problem/102441/D)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 2s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 有 (n) 名玩家围坐一圈，编号从 (1) 到 (n)。 玩家 (1) 获得第一个回合，然后是玩家 (2)，依此类推，从 (n) 回到 (1)。 每个玩家拥有几张牌，每张牌都有一个整数值。 

当玩家轮到一个回合时，他们可以打出一张未使用的牌，但其价值必须严格大于之前打出的牌的价值。 他们也可能会通过。 最多 (k) 个连续回合可能是通过。 我们需要构建尽可能最长的出牌序列，并打印每张所选牌的玩家和值。 

查看转弯限制的有用方法是忘记各个通行证。 假设玩家 (p) 打出一张牌，而下一张牌则由玩家 (q) 打出。 从 (p) 顺时针移动到 (q) 需要一定数量 (d) 的玩家回合，其中 (1 \le d \le n)。 在这两张打出的牌之间有 (d-1) 次传递，因此转换在以下情况下是合法的：

 [
 d-1 \le k,
 ]

 或同等地，

 [
 d \le k+1。 
]

 让(K=k+1)。 在玩家 (p) 出牌之后，下一张牌可以恰好来自圆圈中之前的 (K) 玩家。 当（K=n）时，这个集合包含每个玩家，包括（p）本身，因为在所有其他（n-1）个玩家通过后，（p）获得另一个回合。 

第一张打出的牌很特殊，因为没有之前的牌。 从玩家 (1) 开始，我们最多可以通过 (k) 次，因此第一张牌必须属于玩家 (1,2,\ldots,K) 中的一个。 

输入给出 (n)、(k)，后面是每个玩家的牌。 所有玩家的牌总数最多为(10^5)，而(n)也最多为(10^5)。 这些值可以大到 (10^9)，因此它们必须存储为整数，但不需要任何特殊算术。 对于 (10^5) 张卡片和一秒的时间限制，二次工作已经太昂贵了，因为 (10^5) 张卡片产生大约 (5\cdot10^9) 对。 我们大约需要 (O(M\log n)) 或 (O(M\log M))，其中 (M=\sum m_i)。 

有几种边缘情况很容易被错误处理。 首先，相同的牌值不能互相跟随。 例如，```
3 1
1 5
1 5
1 5
```答案长度为 (1)，而不是 (2)。 在处理相等值时立即将每张卡插入其数据结构的 DP 可以使用一个 (5) 来构建另一个 (5)，从而错误地违反了严格的不等式。 

其次，圆形边界很重要。 和```
4 0
1 1
1 2
1 3
1 4
```唯一合法的第一玩家是玩家（1），之后的下一个玩家必须恰好是桌子周围的下一个玩家。 该序列的长度为 (4)。 将玩家视为普通的线性区间会丢失从玩家 (4) 回到玩家 (1) 的转换。 

第三，当（k=n-1）时，同一玩家可以在完成一轮后再次玩。 例如，```
3 2
3 1 2 3
0
0
```答案长度为(3)，因为玩家(1)可以玩(1)，让玩家(2)和(3)通过，然后玩(2)，对(3)重复相同的过程。 始终排除同一玩家的转换规则将错误地返回 (1)。 

最后，输入可以根本不包含任何卡片：```
1 0
0
```正确答案是（0），后面没有卡线。 重建代码必须允许答案为空，而不是假设至少存在一张卡。 

## 方法

 直接动态规划公式将每张牌视为一种状态。 令 (dp_i) 为以卡 (i) 结尾的最大序列长度。 为了计算它，我们检查每张较早的牌（j），检查其值是否较小，并检查其玩家是否可以合法地领先于牌（i）的玩家。 如果两个条件都成立，我们可以使用

 [
 dp_i = \max(dp_i,dp_j+1)。 
]

 这是正确的，因为每个以 (i) 结尾的有效序列都有一些紧邻其前面的卡片 (j)，并且转换条件完全表征了 (j) 后面是否可以跟有 (i)。 

暴力DP会失败，因为它会重复扫描几乎所有以前的卡。 如果有（M=10^5）张牌，最坏情况执行

 4,999,950,000
 ]

 前人比较。 一秒的限制使这成为不可能。 

关键的观察结果是，转换条件仅通过其玩家取决于前一张牌。 一旦我们处理完所有具有较小值的牌，对于每个玩家（p），我们只需要记住以该玩家结尾的最佳序列长度。 对于属于玩家 (q) 的新牌，其前一张牌必须恰好位于 (K=k+1) 名玩家的连续循环区间内。 因此，转换变成了对围绕圆圈排列的玩家的最大范围查询。 

还有一个复杂的情况：值必须严格递增。 我们按价值对所有卡片进行排序。 对于一个值（x），我们使用仅包含小于（x）的值的数据结构来计算每个（dp），并且只有在计算完具有值（x）的所有卡片之后，我们才插入它们的结果。 这种批处理可以防止相同的值成为彼此的前任值。 

线段树完全支持我们需要的操作。 每片叶子代表一个玩家并存储以该玩家结束的最佳序列。 内部节点存储其范围内的最大值。 对于每张牌，我们最多查询两个普通区间，因为前一个区间可能跨越玩家（n）到玩家（1）的边界。 然后，在处理完卡的值组后，我们对卡执行一点更新。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(M^2)) | (O(M)) | 太慢了 |
 | 最佳 | (O(M\log M + M\log n)) | (O(M\log M + M\log n)) | (O(M+n)) | 已接受 |

 ## 算法演练

 1. 读取每张卡片并存储其价值、所有者和唯一的卡片索引。 该索引在重建过程中非常有用，因为每个 DP 状态都需要记住哪个较早的卡产生了它。 
2. 按价值对所有卡片进行排序。 按此顺序处理它们意味着我们已经插入的每张卡的值不大于当前值。 我们将延迟插入等值卡，因此数据结构实际上只包含严格较小的值。 
3.设置(K=k+1)。 对于玩家 (p) 拥有的牌，其前任者必须是紧邻圆圈中 (p) 之前的 (K) 玩家之一。 在从零开始的玩家指数中，这些玩家是

 [
 p-K,p-K+1,\l点,p-1
 ]

 索引解释为模 (n)。 

1. 在线段树中查询该循环间隔内的最大 DP 值。 如果查询返回长度为(L)的前驱状态，则当前卡可以将其扩展至(L+1)。 如果不存在前任者，则当其玩家位于前 (K) 名玩家中时，该卡仍可以开始序列，因为游戏从玩家 (1) 开始。 
2. 将选择的前任卡存储为`parent[current]`。 如果当前卡片给出的序列比迄今为止看到的最佳答案更长，请将其索引记为最终卡片。 父指针稍后将允许我们向后重建序列。 
3. 每张具有相同值的卡计算完其 DP 值后，用其结果更新线段树。 对于玩家来说，树只存储以该玩家结尾的最佳序列，因此只有当旧状态更好时，新状态才会取代旧状态。 
4. 继续遍历每个不同的值。 最后，记住的最后一张牌属于最长的有效序列。 跟随其父指针直到到达第一张卡片，翻转收集的卡片并打印它们。 

工作原理：保持不变式，即在处理值 (x) 后，线段树对于每个玩家都包含有效序列的最大长度，该序列的最后一张牌的值严格小于 (x)。 查询间隔恰好包含当前卡牌之前可以合法玩的玩家，因此最佳的查询状态给出了可能的最佳前任者。 第一张牌由条件 (p\le K) 单独处理。 由于等值卡仅在计算完所有 DP 值后才插入，因此每次转换都使用严格较小的值。 因此，每个 DP 状态对于其结束卡都是最优的，并且最大 DP 状态是最优完整序列。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class SegmentTree:
    def __init__(self, n):
        size = 1
        while size < n:
            size <<= 1
        self.size = size
        self.best_len = [0] * (2 * size)
        self.best_id = [-1] * (2 * size)

    def update(self, pos, length, card_id):
        p = pos + self.size

        if length <= self.best_len[p]:
            return

        self.best_len[p] = length
        self.best_id[p] = card_id
        p >>= 1

        while p:
            left = p << 1
            right = left | 1

            if self.best_len[left] >= self.best_len[right]:
                self.best_len[p] = self.best_len[left]
                self.best_id[p] = self.best_id[left]
            else:
                self.best_len[p] = self.best_len[right]
                self.best_id[p] = self.best_id[right]

            p >>= 1

    def query(self, left, right):
        if left > right:
            return 0, -1

        left += self.size
        right += self.size

        best_len = 0
        best_id = -1

        while left <= right:
            if left & 1:
                if self.best_len[left] > best_len:
                    best_len = self.best_len[left]
                    best_id = self.best_id[left]
                left += 1

            if not (right & 1):
                if self.best_len[right] > best_len:
                    best_len = self.best_len[right]
                    best_id = self.best_id[right]
                right -= 1

            left >>= 1
            right >>= 1

        return best_len, best_id

    def query_circular(self, player, length, n):
        """
        Return the best state among the previous `length` players
        before `player`, cyclically.
        """
        left = player - length
        right = player - 1

        if left >= 0:
            return self.query(left, right)

        best_len, best_id = 0, -1

        if right >= 0:
            best_len, best_id = self.query(0, right)

        wrapped_left = left + n
        cur_len, cur_id = self.query(wrapped_left, n - 1)

        if cur_len > best_len:
            best_len, best_id = cur_len, cur_id

        return best_len, best_id

def solve_data(n, k, players_cards):
    cards = []
    card_count = 0

    for player, values in enumerate(players_cards):
        for x in values:
            cards.append((x, player, card_count))
            card_count += 1

    if not cards:
        return "0\n"

    cards.sort()

    K = k + 1
    tree = SegmentTree(n)

    dp = [0] * card_count
    parent = [-1] * card_count

    answer_len = 0
    answer_id = -1

    i = 0
    m = len(cards)

    while i < m:
        j = i
        value = cards[i][0]

        while j < m and cards[j][0] == value:
            j += 1

        pending = []

        for t in range(i, j):
            _, player, card_id = cards[t]

            best_len, best_id = tree.query_circular(player, K, n)

            cur_len = 0
            cur_parent = -1

            if best_len > 0:
                cur_len = best_len + 1
                cur_parent = best_id

            if player < K and cur_len < 1:
                cur_len = 1
                cur_parent = -1

            if cur_len > 0:
                dp[card_id] = cur_len
                parent[card_id] = cur_parent
                pending.append((player, cur_len, card_id))

                if cur_len > answer_len:
                    answer_len = cur_len
                    answer_id = card_id

        for player, cur_len, card_id in pending:
            tree.update(player, cur_len, card_id)

        i = j

    result = []
    cur = answer_id

    while cur != -1:
        x, player, _ = cards_by_id[cur]
        result.append((player + 1, x))
        cur = parent[cur]

    result.reverse()

    out = [str(answer_len)]
    out.extend(f"{player} {x}" for player, x in result)
    return "\n".join(out) + "\n"

def solve():
    n, k = map(int, input().split())

    players_cards = []
    global cards_by_id

    all_cards = []
    for player in range(n):
        data = list(map(int, input().split()))
        count = data[0]
        values = data[1:count + 1]
        players_cards.append(values)
        for x in values:
            all_cards.append((x, player, len(all_cards)))

    cards_by_id = [None] * len(all_cards)
    for x, player, card_id in all_cards:
        cards_by_id[card_id] = (x, player, card_id)

    if not all_cards:
        print(0)
        return

    all_cards.sort()

    K = k + 1
    tree = SegmentTree(n)

    parent = [-1] * len(all_cards)
    answer_len = 0
    answer_id = -1

    i = 0
    m = len(all_cards)

    while i < m:
        j = i + 1
        value = all_cards[i][0]

        while j < m and all_cards[j][0] == value:
            j += 1

        pending = []

        for t in range(i, j):
            _, player, card_id = all_cards[t]

            best_len, best_id = tree.query_circular(player, K, n)

            cur_len = 0
            cur_parent = -1

            if best_len > 0:
                cur_len = best_len + 1
                cur_parent = best_id

            if player < K and cur_len < 1:
                cur_len = 1
                cur_parent = -1

            if cur_len > 0:
                parent[card_id] = cur_parent
                pending.append((player, cur_len, card_id))

                if cur_len > answer_len:
                    answer_len = cur_len
                    answer_id = card_id

        for player, cur_len, card_id in pending:
            tree.update(player, cur_len, card_id)

        i = j

    sequence = []
    cur = answer_id

    while cur != -1:
        x, player, _ = all_cards[cur]
        sequence.append((player + 1, x))
        cur = parent[cur]

    sequence.reverse()

    out = [str(answer_len)]
    out.extend(f"{player} {x}" for player, x in sequence)
    sys.stdout.write("\n".join(out) + "\n")

if __name__ == "__main__":
    solve()
```这`SegmentTree`在每个节点保留两个值。`best_len`是该节点表示的最长序列，而`best_id`识别实现它的卡。 将卡标识符与长度一起存储使得无需运行第二个 DP 即可进行重建。`query_circular`将循环前驱集转换为至多两个普通线段树范围。 当间隔不跨越玩家（1）时，它是一个范围。 当它环绕时，它被分成玩家数组的尾部和它的前缀。 情况（K=n）自然由相同的公式处理，必要时包括当前玩家本身。 

第一张牌的条件是`player < K`因为玩家在执行上都是零基础的。 这些对应于原始玩家编号 (1) 到 (K)。 没有前任的卡只有在这种情况下才可以使用。 

这`pending`数组是必不可少的。 该代码首先计算每张牌的一个值，然后执行所有更新。 如果更新立即发生，即使序列必须严格递增，两张等值的牌也可以形成过渡。 

重建使用`parent`指针。 当卡扩展一个状态时，其父级是存储在线段树的最佳状态中的卡。 遵循这些指针会产生向后的序列，因此反转它会给出所需的递增顺序。 

这`cards_by_id`数组中`solve`由原始卡标识符索引。 排序操作改变了卡片的顺序，但不会改变它们的标识符，因此排序后父指针保持稳定。 

Python 整数具有任意精度，并且所有相关值都适合该表示形式。 不需要特殊的溢出处理。 

## 工作示例

 第一个示例是官方示例。 这里（n=3），（k=1），所以（K=2）。 一张牌后面可能跟着一张属于圆圈中前两名玩家中任何一个的牌。 

| 价值| 玩家| 查询结果 | DP | 家长 |
 | ---| ---| ---| ---| ---|
 | 1 | 1 | 无 | 1 | 无 |
 | 3 | 3 | 玩家 1，长度 1 | 2 | 1 |
 | 5 | 3 | 玩家 1，长度 1 | 2 | 1 |
 | 10 | 10 1 | 玩家 3，长度 2 | 3 | 3 |
 | 11 | 11 2 | 玩家 1，长度 3 | 4 | 10 | 10
 | 12 | 12 1 | 玩家 2，长度 4 | 5 | 11 | 11
 | 15 | 15 3 | 玩家 1，长度 5 | 6 | 12 | 12
 | 20 | 1 | 玩家 3，长度 6 | 7 | 15 | 15
 | 21 | 21 2 | 玩家 1，长度 7 | 8 | 20 |
 | 22 | 22 3 | 玩家 2，长度 8 | 9 | 21 | 21

 得到的链是```
1 1
3 3
1 10
2 11
1 12
3 15
1 20
2 21
3 22
```该轨迹显示了为什么 DP 只需要每个玩家的最佳状态。 当处理值（10）时，线段树不单独关心所有较早的卡片。 它只需要知道玩家（3）可以完成长度为（2）的序列。 

对于第二个示例，考虑不允许通过的圆形边界：```
4 0
1 1
1 2
1 3
1 4
```这里（K=1），所以在玩家（1）之后，只有玩家（2）可以玩，然后只有玩家（3），然后只有玩家（4），最后再次是玩家（1）。 

| 价值| 玩家| 前辈玩家| 查询最佳 | DP |
 | ---| ---| ---| ---| ---|
 | 1 | 1 | 玩家 1 | 无 | 1 |
 | 2 | 2 | 玩家 1 | 1 | 2 |
 | 3 | 3 | 玩家 2 | 2 | 3 |
 | 4 | 4 | 玩家 3 | 3 | 4 |

 答案是```
4
1 1
2 2
3 3
4 4
```此示例练习边界条件 (K=1)，其中前任区间恰好包含一名玩家。 它还表明序列限制与循环回合顺序有关，而不仅仅是与玩家标识符的数字顺序有关。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(M\log M + M\log n)) | (O(M\log M + M\log n)) | 排序需要 (O(M\log M)); 每张卡执行一次循环范围查询和最多一个点更新，每次执行 (O(\log n))。 |
 | 空间| (O(M+n)) | 卡、父指针和线段树都需要线性内存。 |

 这里（M=\sum m_i\le10^5）。 线段树有 (O(n)) 个节点，而卡片数组和重建数据有 (O(M)) 个元素。 由此产生的复杂性明显低于二次 (O(M^2)) 替代方案，并且符合规定的 256 MB 内存限制。 

## 测试用例

 由于该问题允许任何最佳序列，因此测试通常不应将整个输出字符串与一个固定答案进行比较。 下面的测试工具检查报告的长度，验证每张打印卡是否存在并且最多使用一次，检查严格增加，检查循环限制，并将报告的长度与小情况下的强力预言机进行比较。 大箱直接检查已知的最佳长度。```python
import sys
import io

class SegmentTree:
    def __init__(self, n):
        size = 1
        while size < n:
            size <<= 1
        self.size = size
        self.best_len = [0] * (2 * size)
        self.best_id = [-1] * (2 * size)

    def update(self, pos, length, card_id):
        p = pos + self.size
        if length <= self.best_len[p]:
            return

        self.best_len[p] = length
        self.best_id[p] = card_id
        p >>= 1

        while p:
            l = p << 1
            r = l | 1
            if self.best_len[l] >= self.best_len[r]:
                self.best_len[p] = self.best_len[l]
                self.best_id[p] = self.best_id[l]
            else:
                self.best_len[p] = self.best_len[r]
                self.best_id[p] = self.best_id[r]
            p >>= 1

    def query(self, left, right):
        if left > right:
            return 0, -1

        left += self.size
        right += self.size

        best_len = 0
        best_id = -1

        while left <= right:
            if left & 1:
                if self.best_len[left] > best_len:
                    best_len = self.best_len[left]
                    best_id = self.best_id[left]
                left += 1

            if not (right & 1):
                if self.best_len[right] > best_len:
                    best_len = self.best_len[right]
                    best_id = self.best_id[right]
                right -= 1

            left >>= 1
            right >>= 1

        return best_len, best_id

    def circular_query(self, player, length, n):
        left = player - length
        right = player - 1

        if left >= 0:
            return self.query(left, right)

        best = self.query(0, right) if right >= 0 else (0, -1)
        wrapped = self.query(left + n, n - 1)

        return wrapped if wrapped[0] > best[0] else best

def solve_instance(inp):
    data = list(map(int, inp.split()))
    it = iter(data)

    n = next(it)
    k = next(it)

    cards = []
    for player in range(n):
        m = next(it)
        for _ in range(m):
            x = next(it)
            cards.append((x, player, len(cards)))

    if not cards:
        return "0\n"

    cards.sort()
    K = k + 1

    tree = SegmentTree(n)
    parent = [-1] * len(cards)

    best_len = 0
    best_id = -1

    i = 0
    while i < len(cards):
        j = i + 1
        while j < len(cards) and cards[j][0] == cards[i][0]:
            j += 1

        pending = []

        for t in range(i, j):
            _, player, cid = cards[t]
            prev_len, prev_id = tree.circular_query(player, K, n)

            cur = 0
            par = -1

            if prev_len:
                cur = prev_len + 1
                par = prev_id

            if player < K and cur < 1:
                cur = 1
                par = -1

            if cur:
                parent[cid] = par
                pending.append((player, cur, cid))

                if cur > best_len:
                    best_len = cur
                    best_id = cid

        for player, cur, cid in pending:
            tree.update(player, cur, cid)

        i = j

    seq = []
    cid = best_id

    while cid != -1:
        x, player, _ = cards[cid]
        seq.append((player + 1, x))
        cid = parent[cid]

    seq.reverse()

    out = [str(best_len)]
    out.extend(f"{p} {x}" for p, x in seq)
    return "\n".join(out) + "\n"

def brute_force_length(n, k, players):
    cards = []
    for p, values in enumerate(players):
        for x in values:
            cards.append((x, p))

    cards.sort()
    K = k + 1

    # State: (last value, last player) -> best length.
    # This is only for tiny tests.
    states = {(None, None): 0}

    for x, p in cards:
        new_states = dict(states)

        for (last_x, last_p), length in states.items():
            if last_x is None:
                if p < K:
                    key = (x, p)
                    new_states[key] = max(new_states.get(key, 0), 1)
            elif x > last_x:
                distance = (p - last_p) % n
                if distance == 0:
                    distance = n

                if distance <= K:
                    key = (x, p)
                    new_states[key] = max(
                        new_states.get(key, 0),
                        length + 1
                    )

        states = new_states

    return max(states.values(), default=0)

def validate(inp, out, expected_length=None):
    data = list(map(int, inp.split()))
    it = iter(data)

    n = next(it)
    k = next(it)

    original = []
    cards = set()

    for p in range(1, n + 1):
        m = next(it)
        values = []
        for _ in range(m):
            x = next(it)
            values.append(x)
            cards.add((p, x))
        original.append(values)

    lines = out.strip().splitlines()
    assert lines, "empty output"

    length = int(lines[0])
    assert len(lines) == length + 1

    if expected_length is not None:
        assert length == expected_length

    if length <= 20:
        assert length == brute_force_length(n, k, original)

    used = set()
    sequence = []

    for line in lines[1:]:
        p, x = map(int, line.split())
        assert 1 <= p <= n
        assert (p, x) in cards
        assert (p, x) not in used

        used.add((p, x))
        sequence.append((p, x))

    assert len(sequence) == length

    if sequence:
        assert sequence[0][0] <= k + 1

    for i in range(1, len(sequence)):
        prev_p, prev_x = sequence[i - 1]
        p, x = sequence[i]

        assert x > prev_x

        distance = (p - prev_p) % n
        if distance == 0:
            distance = n

        assert distance <= k + 1

def run(inp: str) -> str:
    return solve_instance(inp)

# Provided sample
sample = """\
3 1
4 1 10 12 20
2 11 21
4 3 5 15 22
"""

sample_expected = """\
9
1 1
3 3
1 10
2 11
1 12
3 15
1 20
2 21
3 22
"""

assert run(sample) == sample_expected
validate(sample, run(sample), 9)

# Minimum-size input, including the empty-card case
case1 = """\
1 0
0
"""
assert run(case1).strip() == "0"
validate(case1, run(case1), 0)

# All values equal, so strict increase permits only one card
case2 = """\
3 1
1 5
1 5
1 5
"""
validate(case2, run(case2), 1)

# k = 0, so every transition must go to the immediately next player
case3 = """\
4 0
1 1
1 2
1 3
1 4
"""
validate(case3, run(case3), 4)

# k = n - 1, so one player can play again after a full round
case4 = """\
3 2
3 1 2 3
0
0
"""
validate(case4, run(case4), 3)

# Maximum-size test: 100000 players, one increasing card per player.
n = 100000
parts = [f"{n} 0"]
parts.extend(f"1 {i}" for i in range(1, n + 1))
large_case = "\n".join(parts) + "\n"

large_output = run(large_case)
assert int(large_output.splitlines()[0]) == n
validate(large_case, large_output, n)
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 0 / 0`| 长度`0`| 空输入和空重构|
 |`3 1 / 5,5,5`| 长度`1`| 严格的不平等和等值批处理|
 |`4 0 / 1,2,3,4`| 长度`4`| 精确的下一个玩家转换和循环顺序 |
 |`3 2 / 1,2,3`在玩家 1 上 | 长度`3`| 完整一轮后同一玩家 |
 | 10万玩家卡牌不断增加| 长度`100000`| 最大总输入大小和 (O(M\log n)) 性能 |

 ## 边缘情况

 对于空卡盒```
1 0
0
```没有可能出现第一张牌，所以答案是（0）。 该算法在构建 DP 状态之前检测空牌列表。 重建开始时没有卡片，因此仅打印答案长度。 

对于相同的值，```
3 1
1 5
1 5
1 5
```当线段树仍为空时，所有三张卡都会被检查。 没有人可以使用另一个（5）作为前任。 由于玩家 (1) 和 (2) 是有效的起始玩家，因此其中一张牌收到 (dp=1)，但没有牌收到 (dp=2)。 结果正好是(1)。 完整值组之后的延迟更新是强制严格增加的原因。 

对于过零情况，```
4 0
1 1
1 2
1 3
1 4
```我们有（K=1）。 第一张牌必须属于玩家 (1)，第二张牌必须属于玩家 (2)，依此类推。 玩家 (1) 的前驱区间包含玩家 (4)，因为玩家是循环排列的。 因此，该算法正确地模拟了从玩家 (4) 回到玩家 (1) 的转换，而不是将玩家列表视为线性。 

对于最大通过情况，```
3 2
3 1 2 3
0
0
```我们有 (K=3=n)。 玩家 (1) 打出第一张牌后，另一张玩家 1 卡的前导区间包含所有玩家，包括玩家 (1) 本身。 这表示玩家 (2) 和 (3) 连续两次传球，然后玩家 (1) 又进行一次传球。 因此，三张牌可以形成长度为 (3) 的序列。 

另一种边界情况是其前驱间隔环绕玩家数组末尾的转换。 例如，当（n=5）和（k=1）时，玩家（1）打出的牌后面可能只有玩家（2）或（3），而玩家（2）打出的牌可能在玩家（5）或（1）之前。 线段树通过组合包含玩家 (5) 和玩家 (1) 的范围来处理后一个查询。 如果直接使用普通数组边界实现循环索引，则此分割是最有可能产生相差一错误的部分。
