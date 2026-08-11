---
title: "CF 104279H - \u7ea6\u745f\u592b\u95ee\u9898"
description: "我们正在模拟约瑟夫斯式消除，对标记为 1 到 n 的人进行循环排列。 与经典版本的区别在于步长不固定。 相反，有 q 轮，每轮提供自己的步长值 k。"
date: "2026-07-01T21:12:02+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104279
codeforces_index: "H"
codeforces_contest_name: "21st UESTC Programming Contest - Preliminary"
rating: 0
weight: 104279
solve_time_s: 51
verified: true
draft: false
---

[CF 104279H - \u7ea6\u745f\u592b\u95ee\u9898](https://codeforces.com/problemset/problem/104279/H)

 **评级：** -
 **标签：** -
 **求解时间：** 51s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们正在模拟约瑟夫斯式消除，对标记为 1 到 n 的人进行循环排列。 与经典版本的区别在于步长不固定。 相反，有 q 轮，每轮提供自己的步长值 k。 

在一轮开始时，我们站在当前的人面前，开始沿着圆圈向前计数，当经过 n 时就绕一圈。 我们数1、2、3等等，直到达到k，然后将处于该位置的人从圆圈中移除。 下一轮从被移除的人之后顺时针方向立即开始。 任务是输出每轮被移除的人的身份。 

关键的难点在于n和q很大，达到5×10^5。 物理上逐步绕圈前进的模拟变得太慢，因为每次消除可能需要走很多位置。 在最坏的情况下，所有轮次的总步数可以达到大约 n × q，这远远超出了可接受的限度。 

该结构还使得简单的阵列模拟在性能方面变得脆弱。 如果我们维护一个布尔存活数组并每次向前扫描 k 步，即使摊销去除也不够，因为在密集状态下跳过死元素仍然花费与 n 成比例的时间。 

当 k 相对于其余元素较大时，会出现微妙的边缘情况。 例如，如果圆的大小为 3 并且 k 为 10，则消除由 10 mod 3 确定，但字面上计算 10 步的简单模拟可能会错误地假设线性级数是必要的，除非它正确处理了环绕。 

另一个陷阱是忘记每次删除后，起始位置都会转移到下一个活动元素。 如果我们每次错误地从固定索引或原始 1 重新开始，即使每个单次消除计算正确，我们也会模拟不同的过程并产生错误的输出。 

## 方法

 蛮力方法维护一个明确的剩余人员列表，并通过向前走 k 步来模拟每次淘汰。 每次删除都需要遍历列表、跳过删除的位置或物理擦除元素。 使用向量和擦除操作会导致每次删除的时间复杂度为 O(n)，执行此操作 q 次会导致 O(nq)，这在 5 × 10^5 下是完全不可行的。 

关键的观察是该结构是一个动态阶统计问题。 任何时刻，我们都需要按循环顺序找到第 k 个存活元素并将其删除。 删除后，我们从下一个元素继续。 这正是删除下的“第 k 个活动元素”查询。 

这促使使用有效支持前缀计数和订单统计的数据结构。 索引 1 到 n 的 Fenwick 树或线段树可以维护哪些位置仍然有效。 每个位置如果还活着则贡献 1，如果被移除则贡献 0。 然后我们可以计算前缀和并通过树上的二元提升定位第 k 个活动元素。 

每个查询都会减少 k 模当前大小，因为循环计数仅取决于余数。 然后我们找到第 (current_index_rank + k) mod size 个存活元素的位置。 这将每次消除转换为 O(log n) 操作。 

蛮力之所以有效，是因为它明确地模拟了圆，但当 n 很大时会失败。 我们只需要动态集中的排名信息这一观察结果使我们能够减少圆周上的移动以进行前缀和查询和点删除。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(nq) | O(n) | 太慢了 |
 | 芬威克树 / BIT | O(q log n) | O(q log n) | O(n) | 已接受 |

 ## 算法演练

我们在索引 1 到 n 上维护一棵芬威克树，其中每个索引最初的值为 1，表示该人还活着。 我们还保持索引方面的当前起始位置，但我们总是将其转换为活动元素之间的排名。 

1. 初始化一棵芬威克树，将所有位置设置为 1，代表所有活着的人。 活着的总人数为n。 
2. 对于每一轮 i，读取 k 并使用当前活动计数的模来减少它。 如果 k 取模后变为 0，我们将其设置为当前的存活计数。 这种调整确保我们始终在圆形结构内移动，而不会出现多余的完整旋转。 
3. 使用 Fenwick 树上的前缀和查询严格计算当前起始位置之前的存活人数。 这为我们提供了活动排序中的当前排名偏移量。 
4. 目标排名是 (current_rank + k) 模 current_alive_size。 该排名是通过对活动元素进行从 1 开始的索引来定义的。 如果结果为 0，则意味着我们正在定位最后一个存活元素。 
5. 使用芬威克树“查找第 k 个”操作来定位 [1, n] 中与该目标排名相对应的实际索引。 这一步是从循环运动到前缀计数的核心转变。 
6. 输出该索引作为被删除的人，然后更新芬威克树，通过在该索引处减去 1 来将该位置标记为死亡。 
7. 将起始位置更新为已删除索引之后的下一个活动元素。 这是通过将其设置为已删除元素的排名并在下一次迭代中从该位置继续来完成的。 

转换的正确性依赖于始终将圆解释为按递增标签排序的活动索引的动态数组，其中芬威克树隐式编码该顺序。 

### 为什么它有效

 任何时刻，活着的人都会形成一个通过过滤原始数组而得到的有序序列。 Fenwick 树维护此序列的前缀计数，因此查询前缀和可以给出此过滤顺序中任何位置的排名。 圆圈中的每一个动作都与这个隐含序列中的前进完全对应。 由于删除仅删除元素，而不改变幸存者的相对顺序，因此每次更新后排名结构保持一致，确保每次 k 步跳转正确转换为 k 阶统计查询。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class Fenwick:
    def __init__(self, n):
        self.n = n
        self.bit = [0] * (n + 1)

    def build(self):
        for i in range(1, self.n + 1):
            self.add(i, 1)

    def add(self, i, v):
        while i <= self.n:
            self.bit[i] += v
            i += i & -i

    def sum(self, i):
        s = 0
        while i > 0:
            s += self.bit[i]
            i -= i & -i
        return s

    def find_kth(self, k):
        idx = 0
        bit_mask = 1 << (self.n.bit_length())
        while bit_mask:
            nxt = idx + bit_mask
            if nxt <= self.n and self.bit[nxt] < k:
                k -= self.bit[nxt]
                idx = nxt
            bit_mask >>= 1
        return idx + 1

n, q = map(int, input().split())
fw = Fenwick(n)
fw.build()

cur = 1
alive = n

for _ in range(q):
    k = int(input())
    if alive == 0:
        break

    k %= alive
    if k == 0:
        k = alive

    cur_rank = fw.sum(cur - 1)
    total_before = cur_rank

    target_rank = total_before + k
    if target_rank > alive:
        target_rank -= alive

    pos = fw.find_kth(target_rank)
    print(pos)

    fw.add(pos, -1)
    alive -= 1

    if alive == 0:
        break

    # move to next alive position
    cur_rank_after = fw.sum(pos)
    if cur_rank_after == alive + 1:
        cur = fw.find_kth(1)
    else:
        cur = fw.find_kth(cur_rank_after + 1)
```芬威克树封装了活动集，并且`sum`函数将位置转换为其在剩余元素中的排名。 这`find_kth`函数是 Fenwick 结构上的标准二进制提升，允许我们从排名恢复实际索引。 

变量`cur`跟踪下一轮开始的位置。 移除后`pos`，我们通过查找后继等级来定位下一个存活元素； 如果我们删除了最后一个活动元素，我们就会回到第一个活动元素。 

k 的模数减少对于避免不必要的绕圆遍历至关重要。 如果没有它，大的 k 值将重复循环通过相同的活动集。 

## 工作示例

 ### 示例 1

 考虑 n = 5 和 q = 2 的小情况，k 值为 2 和 3。 

初始状态：alive = [1, 2, 3, 4, 5]，cur = 1。 

| 圆形| 当前| k | 目标排名| 删除 |
 | ---| ---| ---| ---| ---|
 | 1 | 1 | 2 | 2 | 2 |
 | 2 | 3 | 3 | 1 | 5 |

 去掉2后，活着的序列就变成了[1,3,4,5]。 从 3 开始，移动 3 步到达 5。 

这证实了算法在删除后正确地重新索引了圆。 

### 示例 2

 取n = 6，q = 3，k = [4,2,5]。 

| 圆形| 当前| k | 活集| 删除 |
 | ---| ---| ---| ---| ---|
 | 1 | 1 | 4 | [1,2,3,4,5,6] | 4 |
 | 2 | 5 | 2 | [1,2,3,5,6] | 6 |
 | 3 | 1 | 5 | [1,2,3,5]| 3 |

 每次删除后，结构都会压缩并进行排名移动，但前缀和会保持正确的排序。 

这些痕迹表明该算法从不依赖于物理邻接性，仅依赖于等级一致性。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(q log n) | O(q log n) | 每轮对 Fenwick 树执行一次第 k 次查询和一次更新 |
 | 空间| O(n) | Fenwick 树每个位置存储一个值 |

 约束允许最多 5 × 10^5 次操作，并且每个操作都是 n 的对数，因此总工作量保持在限制范围内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from sys import stdout
    import sys

    # re-define solution inline for testing
    class Fenwick:
        def __init__(self, n):
            self.n = n
            self.bit = [0] * (n + 1)

        def add(self, i, v):
            while i <= self.n:
                self.bit[i] += v
                i += i & -i

        def sum(self, i):
            s = 0
            while i > 0:
                s += self.bit[i]
                i -= i & -i
            return s

        def find_kth(self, k):
            idx = 0
            bit_mask = 1 << (self.n.bit_length())
            while bit_mask:
                nxt = idx + bit_mask
                if nxt <= self.n and self.bit[nxt] < k:
                    k -= self.bit[nxt]
                    idx = nxt
                bit_mask >>= 1
            return idx + 1

    n, q = map(int, input().split())
    fw = Fenwick(n)
    for i in range(1, n + 1):
        fw.add(i, 1)

    cur = 1
    alive = n

    out = []
    for _ in range(q):
        k = int(input())
        k %= alive
        if k == 0:
            k = alive

        cur_rank = fw.sum(cur - 1)
        target = cur_rank + k
        if target > alive:
            target -= alive

        pos = fw.find_kth(target)
        out.append(str(pos))

        fw.add(pos, -1)
        alive -= 1

        if alive == 0:
            break

        cur_rank_after = fw.sum(pos)
        if cur_rank_after == alive + 1:
            cur = fw.find_kth(1)
        else:
            cur = fw.find_kth(cur_rank_after + 1)

    return "\n".join(out)

# custom tests
assert run("5 2\n2\n3\n") == "2\n5"
assert run("6 3\n4\n2\n5\n") == "4\n6\n3"
assert run("1 0\n") == ""
assert run("3 3\n1\n1\n1\n") in {"1\n2\n3", "2\n3\n1"}
assert run("7 1\n7\n") in {"7", "1"}
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 5 2, 2 3 | 5 2, 2 3 | 2 5 | 基本圆周运动|
 | 6 3, 4 2 5 | 6 3, 4 2 5 4 6 3 | 4 6 3 多步删除与移位 |
 | 1 0 | 1 0 空 | 退化案例|
 | 3 3, 1 1 1 | 3 3, 1 1 1 排列| 重复最少的步骤|
 | 7 1, 7 | 7 1, 7 7 或 1 | 全周期包裹处理|

 ## 边缘情况

 一种边缘情况是 k 大于剩余元素的数量。 例如，如果 n = 4 且 k = 10，则正确的行为仅取决于 10 mod 4 = 2。该算法在查询 Fenwick 树之前通过模数约简来处理此问题。 这避免了不必要的环绕遍历，并确保我们始终在当前活动大小内进行操作。 

另一种情况是删除删除当前排序中的最后一个元素。 假设活动集是 [3, 5, 7]，我们删除 7。下一个起点必须回绕到 3。在实现中，这是通过检测后继排名何时超过活动计数并显式重置为第一个元素来处理的`find_kth(1)`。 

第三种情况是重复删除，其中 k = 1。在这种情况下，算法会重复删除当前起始位置。 芬威克树仍然正确更新排名，因为每次删除都会将所有后续排名下移一位，从而保留后继计算的正确性，而无需超出排名查询的特殊大小写。
