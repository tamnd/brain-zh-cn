---
title: "CF 102280E - \u0428\u0442\u0440\u0430\u0444"
description: "我们有一系列单独的钞票。 每张纸币都有面额，每张纸币最多可以使用一次。 给定一个罚款金额p，我们需要选择一些总面值尽可能小的可用纸币，同时仍至少为p。"
date: "2026-08-13T09:48:48+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102280
codeforces_index: "E"
codeforces_contest_name: "2010, \u0422\u0440\u0435\u043d\u0438\u0440\u043e\u0432\u043a\u0430 \u0421\u0413\u0410\u0423 aka \u041a\u043e\u043d\u0442\u0435\u0441\u0442 \u043f\u0440\u043e \u043c\u0430\u0440\u0448\u0440\u0443\u0442\u043a\u0438"
rating: 0
weight: 102280
solve_time_s: 189
verified: true
draft: false
---

[CF 102280E - \u0428\u0442\u0440\u0430\u0444](https://codeforces.com/problemset/problem/102280/E)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 9s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一系列单独的钞票。 每张纸币都有面额，每张纸币最多可以使用一次。 给予一定数额的罚款`p`，我们需要选择一些可用的纸币，其总面值尽可能小，同时仍至少`p`。 

输出必须包含最低应付金额以及用于获得该金额的实际面额。 如果没有纸币子集可以到达`p`，答案是`-1`。 

边界对解决方案的影响非常大。 最多有`1000`钞票，而罚款最多是`100000`面额可以大到`1000000`。 传统的子集和动态程序，其状态为`0`到`p`以及每张纸币成本的过渡`O(n p)`，大约可以达到`10^8`状态更新。 由于 1.5 秒的限制，这太昂贵了，尤其是在 Python 中。 我们需要利用状态集是位集这一事实，因此可以同时执行许多子集和转换。 

大面额的界限也很重要。 我们不能简单地制定DP范围`0..sum(q)`，因为总价值可以大到`10^9`。 幸运的是，总和大于`p`不需要在子集求和阶段表示。 最后一张钞票可能是推动总数的那张钞票`p`。 

有几种边缘情况可能会悄悄地破坏原本看似合理的实现。 如果`p = 0`，空集已经是有效的支付，所以答案是`0`，没有纸币。 例如，`0 2`有教派`5 10`必须产生`0`， 不是`5`。 

重复面额的纸币也是单独的纸币。 为了`p = 6`和`n = 3`和`3 3 10`，正确答案是`6`，同时使用`3`钞票。 将输入视为一组面额会错误地丢失其中一个面额。 

一张比罚款金额大的钞票本身可能就是最佳答案。 为了`p = 7`和教派`10 20`，答案是`10`。 DP 最多仅限于金额`p`不能代表`10`，因此算法必须单独考虑钞票作为最后一步。 

最后，达到`p`恰好必须击败每个大于的解决方案`p`。 为了`p = 10`和教派`6 4 20`，答案是`10`， 使用`6 + 4`。 一种仅搜索第一个大于的方法`p`会错过这个最佳情况。 

## 方法

 直接方法是通常的 0/1 子集和动态规划。 让`dp[s]`告诉我们一些经过加工的纸币是否具有准确的总价值`s`。 每张有价值的钞票`q`，我们迭代所有总和并标记`s + q`作为可达的。 这是正确的，因为每个子集要么排除当前钞票，要么包含它，并且按降序迭代总和可以防止多次使用同一张钞票。 

问题在于操作次数。 最多有`1000`纸币及最多`100000`相关金额，大致给出`100000000`最坏情况下的转变。 这对于时间限制来说太多了，Python 特别不适合这样的循环。 

关键的观察是 DP 状态只是一组整数。 我们可以用一个大整数的位来表示该集合。 如果位`s`已设定，总和`s`是可达的。 添加有价钞票`q`然后变成单个整数移位：`bits | (bits << q)`这种转变代表拿走当前的钞票，而原来的钞票`bits`代表跳过它。 Python 的任意精度整数在内部对机器字执行此操作，因此无需处理`p`状态分开，转换并行处理许多状态。 

还有一个问题，因为我们需要实际的钞票，而不仅仅是最低金额。 我们同时解决重建。 每当一笔金额首次达到时，我们就会存储创建该金额的钞票。 由于只有在之前无法到达的情况下才会记录一笔金额，因此在处理当前钞票之前，其前身就已经可以到达。 遵循这些存储的前辈重建一个有效的子集。 

我们还需要处理答案大于的可能性`p`。 在将每张钞票添加到 DP 之前，我们会查看当前可与这张钞票组合的所有可达到的金额，以达到至少`p`。 因为我们一张一张地处理钞票，这些金额只使用较早的钞票，因此当前的钞票不会意外地被使用两次。 我们选择最小的可达总和，给出涉及当前钞票的最小候选者。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |`O(n p)`|`O(p)`| 太慢了|
 | 最佳位组 DP |`O(n p / W + p)`字操作|`O(p)`位加上重建数据| 已接受 |

 这里`W`是 Python 大整数内部使用的机器字大小。 确切的实现成本由所涉及的整数的大小决定，而不是由每个 DP 状态的一次操作决定。 

## 算法演练

 1. 阅读`p`以及钞票清单。 如果`p = 0`,立即输出`0`因为什么都不付已经是可能的最低金额了。 
2. 用一个整数表示当前所有可达的子集和`bits`。 少量`s`恰好在 sum 时设置`s`可以由迄今为止处理过的纸币形成。 最初只是总和`0`是可达的，所以`bits = 1`。 
3. 创建一个`parent`按总和索引的数组`0`通过`p`。 对于每一个新达到的金额`s`，存储创建它的钞票的索引。 的前身是`s`那么就是`s - q[index]`。 
4. 从左到右处理钞票。 添加当前钞票之前`q`, 搜索当前`bits`求最小可达到的总和`s`满意的`s + q >= p`。 如果存在这样的总和，`s + q`是使用当前钞票和早期钞票的有效候选答案。 
5. 保留找到的最小候选者。 如果候选人恰好是`p`，它是全局最优的，所以立即重建它。 没有更多的金额可以改善准确的付款。 
6. 使用当前钞票更新子集和位集`shifted = bits << q`。 将结果限制为最多和`p`，因为不需要较大的中间和。 新达到的金额是`shifted & ~bits`。 
7. 对于每个新达到的金额，将当前钞票索引存储在`parent`。 这些总和是第一次创建的，因此它们之前的状态不可能已经包含它们。 
8. 将移位后的状态合并为`bits`。 如果位`p`设定后，重建准确的付款`parent[p]`因为`p`现在可以访问它本身了。 
9. 如果所有纸币已处理完毕但未到达`p`并且没有找到上面的候选人`p`， 输出`-1`。 否则，通过重复取出存储的母钞并从当前总和中减去其面额来重建最佳候选钞票。 

为什么有效：在处理钞票之前`i`,`bits`恰好包含使用索引小于的钞票可获得的总和`i`。 当我们考察候选人时`s + q[i]`, 钞票`i`不属于`s`，因此得到的子集是有效的。 为每张钞票取最小的候选者，根据其最大索引钞票考虑所有可能的解决方案。 精确总和`p`由子集和 DP 直接处理。 为了重建，每个存储的父项都指向在添加相应钞票之前已经可达的总和，因此重复跟随父项最终达到总和`0`并产生一个有效的子集。 由于每种可能的付款要么恰好是`p`或者最后一张钞票的加法交叉`p`，找到的最小候选者是全局最优值。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    first = input().split()
    if not first:
        return

    p, n = map(int, first)

    if n:
        q = list(map(int, input().split()))
    else:
        q = []

    if p == 0:
        print(0)
        print()
        return

    # Bit s is 1 iff sum s is reachable.
    # We only need sums from 0 through p.
    limit_mask = (1 << (p + 1)) - 1
    bits = 1  # sum 0

    # parent[s] = index of the banknote that first made s reachable.
    parent = [-1] * (p + 1)

    best_sum = None
    best_last = -1
    best_base = -1

    for i, value in enumerate(q):
        # Find the smallest currently reachable s such that
        # s + value >= p.
        threshold = max(0, p - value)

        candidates = bits >> threshold
        if candidates:
            # Position of the lowest set bit in candidates.
            offset = (candidates & -candidates).bit_length() - 1
            base = threshold + offset
            candidate = base + value

            if best_sum is None or candidate < best_sum:
                best_sum = candidate
                best_last = i
                best_base = base

        # If we already have an exact payment, it is optimal.
        if best_sum == p:
            break

        # Add this banknote to the subset-sum DP.
        shifted = (bits << value) & limit_mask
        new_bits = shifted & ~bits

        # Record reconstruction information for sums that are
        # becoming reachable for the first time.
        x = new_bits
        while x:
            low = x & -x
            s = low.bit_length() - 1
            parent[s] = i
            x -= low

        bits |= shifted

        # An exact payment is always better than every payment > p.
        if (bits >> p) & 1:
            best_sum = p
            best_last = -1
            best_base = p
            break

    if best_sum is None:
        print(-1)
        return

    answer = []

    if best_sum == p and best_last == -1:
        # Reconstruct an exact subset ending at sum p.
        cur = p
        while cur > 0:
            i = parent[cur]
            if i == -1:
                print(-1)
                return
            answer.append(q[i])
            cur -= q[i]
    else:
        # The last banknote is best_last, and the earlier banknotes
        # form best_base.
        answer.append(q[best_last])

        cur = best_base
        while cur > 0:
            i = parent[cur]
            if i == -1:
                print(-1)
                return
            answer.append(q[i])
            cur -= q[i]

    print(best_sum)
    print(*answer)

if __name__ == "__main__":
    solve()
```这`bits`整数是中心 DP 结构。 最初设置位零是因为空子集的总和为零。 对于一个教派`value`, 移动`bits`留下来`value`创造了通过拿走这张钞票可以获得的每一笔钱。 将移位后的值与旧位集进行“或”运算表示钞票的两种选择。 

面具`(1 << (p + 1)) - 1`丢弃大于的总和`p`。 不需要这样的总和作为中间状态，因为上面的任何最佳解决方案`p`可以看作下面的可达总和`p`接下来是最后一张钞票。 

表达式`bits >> threshold`删除所有小于的可达总和`threshold`。 其最低设置位对应于最小可达值`s >= threshold`。 这给出了尽可能小的总数`s + value`为当前最终钞票。 

重建数组仅由以下内容填充`new_bits`，不是来自每个设置位`shifted`。 这是至关重要的。 已经可达的总和应该保留其早期的父代，因为该父代描述了没有当前钞票而形成的子集。 仅处理新可达的总和还可以保证每个存储状态的前身已经建立。 

Python 整数不会溢出，因此面额和本身是安全的。 DP 整数被显式屏蔽为`p + 1`位，这会限制其大小并防止大面额创建不必要的大中间整数。 

重建通过间接使用纸币指数`parent`。 重复面额不会造成问题，因为即使输出仅包含面额值，在 DP 期间每次出现都有不同的索引。 

## 工作示例

 ### 示例 1

 输入：```
15 8
20 10 5 5 3 2 1 1
```最优支付方式是`15`， 例如`10 + 5`。 

| 步骤| 钞票| 门槛| 最佳穿越候选人| 更新后可达到的金额 |
 | --- | --- | --- | --- | --- |
 | 1 | 20 | 0 | 20 | 0 |
 | 2 | 10 | 10 5 | 无 | 0, 10 |
 | 3 | 5 | 10 | 10 15 | 15 0、5、10、15 |

 在第三张钞票上，总和`10`使用第二张钞票已经可以到达。 添加`5`准确地给出`15`，因此算法可以停止。 存储的父母重建`10`和`5`。 

这说明了为什么当前钞票在插入位组之前要进行检查。 候选人`10 + 5`使用两种不同的纸币。 

### 示例 2

 输入：```
2 3
10 3 3
```答案是`3`，因为单个`3`至少是最小的可用总和`2`。 

| 步骤| 钞票| 门槛| 最佳穿越候选人| 更新后可达到的金额 |
 | --- | --- | --- | --- | --- |
 | 1 | 10 | 10 0 | 10 | 10 0 |
 | 2 | 3 | 0 | 3 | 0 |
 | 3 | 3 | 0 | 3 | 0 |

 第一张钞票给了候选人`10`。 第二个给出候选人`3`，哪个更好。 第三个还给出`3`，但不会改善答案。 

有趣的细节是上面的总和`p`不存储在`bits`。 教派`10`仍然被正确地视为最终钞票，尽管有点`10`从未出现在DP中。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |`O(n p / W + p)`字操作，加上`O(p)`总重建-家长作业| 每个位集转换过程`p`机器字块中的位，而每个可达总和最多接收一次父级 |
 | 空间|`O(p)`DP 位和`O(p)`父母的整数 | 仅来自`0`通过`p`已存储 |

 和`p <= 100000`，当表示为原始位时，位集本身只有大约 12.5 KB。 父数组更大，因为Python整数是对象，但它仍然只存储`p + 1`条目。 该算法避免了`O(n p)`Python 级别的嵌套循环将成为 1.5 秒限制下的主要性能问题。 

## 测试用例

 确切的输出可能与样本不同，因为该语句允许任何最佳子集。 因此，下面的测试助手会在语义上验证输出，而不是需要一个特定的顺序或子集。```python
import sys
import io

def solve_io(inp: str) -> str:
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

def validate(inp: str, out: str):
    data = inp.split()
    p = int(data[0])
    n = int(data[1])
    bills = list(map(int, data[2:2 + n]))

    lines = out.strip().splitlines()

    if p == 0:
        assert lines[0] == "0"
        return

    if lines[0] == "-1":
        # Verify that no subset can reach p by brute force.
        reachable = {0}
        for x in bills:
            reachable |= {s + x for s in list(reachable)}
        assert all(s < p for s in reachable)
        return

    total = int(lines[0])
    used = list(map(int, lines[1].split())) if len(lines) > 1 and lines[1].strip() else []

    assert total == sum(used)
    assert total >= p

    remaining = bills[:]
    for x in used:
        assert x in remaining
        remaining.remove(x)

    # Verify optimality independently for these small test cases.
    reachable = {0}
    for x in bills:
        reachable |= {s + x for s in list(reachable)}

    optimum = min((s for s in reachable if s >= p), default=None)
    assert optimum == total

def solve():
    first = input().split()
    if not first:
        return

    p, n = map(int, first)
    q = list(map(int, input().split())) if n else []

    if p == 0:
        print(0)
        print()
        return

    limit_mask = (1 << (p + 1)) - 1
    bits = 1
    parent = [-1] * (p + 1)

    best_sum = None
    best_last = -1
    best_base = -1

    for i, value in enumerate(q):
        threshold = max(0, p - value)

        candidates = bits >> threshold
        if candidates:
            offset = (candidates & -candidates).bit_length() - 1
            base = threshold + offset
            candidate = base + value

            if best_sum is None or candidate < best_sum:
                best_sum = candidate
                best_last = i
                best_base = base

        if best_sum == p:
            break

        shifted = (bits << value) & limit_mask
        new_bits = shifted & ~bits

        x = new_bits
        while x:
            low = x & -x
            s = low.bit_length() - 1
            parent[s] = i
            x -= low

        bits |= shifted

        if (bits >> p) & 1:
            best_sum = p
            best_last = -1
            best_base = p
            break

    if best_sum is None:
        print(-1)
        return

    answer = []

    if best_sum == p and best_last == -1:
        cur = p
        while cur:
            i = parent[cur]
            assert i != -1
            answer.append(q[i])
            cur -= q[i]
    else:
        answer.append(q[best_last])
        cur = best_base
        while cur:
            i = parent[cur]
            assert i != -1
            answer.append(q[i])
            cur -= q[i]

    print(best_sum)
    print(*answer)

# Provided sample 1
sample1 = """15 8
20 10 5 5 3 2 1 1
"""
out = solve_io(sample1)
validate(sample1, out)

# Provided sample 2
sample2 = """2 3
10 3 3
"""
out = solve_io(sample2)
validate(sample2, out)

# p = 0, empty payment is optimal.
case3 = """0 0
"""
out = solve_io(case3)
validate(case3, out)

# Exact boundary, requires two equal banknotes.
case4 = """6 3
3 3 10
"""
out = solve_io(case4)
validate(case4, out)

# No possible payment.
case5 = """100 3
20 30 40
"""
out = solve_io(case5)
validate(case5, out)

# Large denomination should be considered as a final banknote.
case6 = """7 2
10 20
"""
out = solve_io(case6)
validate(case6, out)
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`15 8 / 20 10 5 5 3 2 1 1`| 任意子集总计`15`| 提供样品并准确付款重建|
 |`2 3 / 10 3 3`|`3`与一个`3`| 面额大于精值和重复值|
 |`0 0`|`0`| 最小细空子集 |
 |`6 3 / 3 3 10`|`6`与两者`3`纸币| 相同面额的多份 |
 |`100 3 / 20 30 40`|`-1`| 不可能的目标|
 |`7 2 / 10 20`|`10`与一个`10`| 答案严格大于`p`|

 ## 边缘情况

 对于`p = 0`，输入`0 0`在 DP 开始之前处理。 空子集有和`0`，所以算法打印`0`和一个空的第二行。 试图强制至少一张钞票会产生一个非最小的答案。 

对于重复面额，请考虑`6 3`和`3 3 10`。 第一个`3`求和`3`可达，第二个`3`然后求和`6`可达。 总和的父级`6`指向第二张钞票，而 sum 的父项`3`指向第一个。 顺着链条走，会得到两张独立的钞票，都值钱`3`。 

对于大于目标的面额，请考虑`7 2`和`10 20`。 在添加第一张钞票之前，求和`0`是可达的。 自从`0 >= 7 - 10`, 候选人`0 + 10 = 10`立即被记录。 总和没有 DP 状态`10`是必须的。 这正是在位集转换之前执行最终钞票检查的原因。 

如需准确付款，请考虑`10 3`和`6 4 20`。 加工前`4`, 总和`6`已经可达。 阈值为`4`是`6`，所以算法找到候选者`6 + 4 = 10`。 很准确，算法以钞票停止`6`和`4`。 解决方案如`20`永远不允许替换它，因为每个总和等于`p`是最优的。 

对于不可能的付款，请考虑`100 3`和`20 30 40`。 每个子集最多有和`90`，所以位集永远不会设置位`100`，并且没有最终候选钞票达到`100`。 该算法因此打印`-1`。
