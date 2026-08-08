---
title: "CF 102536G - 通用间谍电影"
description: "我们需要构建一系列演员表。 演员阵容是从可用的演员中选出的一组恰好是 g 的演员。 第一个演员阵容已确定。 每一下一部电影都必须通过精确删除一个演员并添加精确一个不同的演员来获得。 此外，演员阵容不得出现两次。"
date: "2026-08-07T21:19:31+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102536
codeforces_index: "G"
codeforces_contest_name: "2020 UP ACM Algolympics Final Round"
rating: 0
weight: 102536
solve_time_s: 158
verified: false
draft: false
---

[CF 102536G - 通用间谍电影](https://codeforces.com/problemset/problem/102536/G)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 38s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们需要构建一系列演员表。 演员表是一组精确的`g`从可用的演员中选择`a`演员。 第一个演员阵容已确定。 每一下一部电影都必须通过精确删除一个演员并添加精确一个不同的演员来获得。 此外，演员阵容不得出现两次。 

任务不是找到特定的序列，而是找到任意长度的有效序列`n`从给定的演员开始。 

重要的限制是`a`至多是`1000`， 尽管`n`至多是`10000`。 可能的类型转换的数量可能非常巨大，因此生成所有类型转换是不可能的。 我们只需要一个有效排序的小前缀。 花费指数时间探索状态空间的解决方案将会失败。 

一个常见的错误是反复用新演员替换同一个演员。 例如，与`g = 2`和演员`{a,b,c,d}`，序列`{a,b}`,`{a,c}`,`{a,d}`即使还有许多未使用的演员，也会立即陷入困境。 变化的位置最终也必须移动。 

另一个错误是忘记演员阵容是一套的。 删除和添加相同的参与者不会产生任何变化，并且输出这样的转换违反了规则。 

## 方法

 强力解决方案会将每个可能的转换视为图中的一个节点。 如果两个节点的演员阵容恰好只有一位演员不同，则两个节点被连接。 从给定的演员表开始，我们可以运行 DFS 并搜索长度为 的路径`n`。 这是正确的，因为每条边都代表合法的电影过渡。 

问题在于该图的大小。 它包含`C(a,g)`州，这个数字太大了。 即使重复检查所有相邻状态也是不可能的`a`达到`1000`。 

有用的观察是强制转换是固定大小的子集。 固定大小的子集具有格雷码排序，其中连续子集通过仅交换一个元素而有所不同。 如果我们可以枚举这样的顺序并使其第一个子集等于给定的演员表，则每个连续的对都会自动成为合法的电影过渡。 

我们通过重新排列演员来做到这一点。 如果我们生成尺寸组合`k`从第一个开始`k`演员，我们可以将最初选择的演员放在重新排序列表中的第一位。 什么时候`g`如果很大，则更容易生成缺失的演员，因为替换演员阵容中的一名成员相当于替换其补充成员中的一名成员。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(C(a,g) * a) | O(C(a,g) * a) | O(C(a,g)) | O(C(a,g)) | 太慢了 |
 | 最佳 | O(n * g) | O(a + g) | 已接受 |

 ## 算法演练

 1.如果铸件尺寸`g`小于或等于演员阵容之外的演员数量，生成演员阵容内部演员的组合。 否则生成演员阵容之外的演员组合。 补码表示使生成的子集保持较小。 
2. 重新排序参与者，使当前子集显示为第一个`k`演员。 格雷码结束`k`选择的演员总是从第一个开始`k`职位。 
3. 递归生成固定大小的格雷码。 上半场让最后一个演员缺席，下半场则保持其在场，同时反转方向。 这种反射使得两半之间的边界只改变了一个演员。 
4. 忽略第一个生成的子集，因为它是初始电影。 对于每个后续子集，将其与前一个子集进行比较。 消失的元素是演员离开，新的元素是演员加入。 
5. 生产完成后停止`n - 1`过渡。 

为什么它有效：生成的顺序具有不变性，即每个连续子集仅在一个选定元素上有所不同。 由于所选元素代表演员阵容中的演员或演员阵容外的演员，因此这始终对应于删除一名演员并添加一名演员。 初始重新排序使第一个生成的子集等于所需的第一部电影，因此整个序列正确启动。 格雷码生成从不重复子集，因此每个电影演员都是唯一的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def gray_combinations(n, k, rev=False, start=0):
    if k == 0:
        yield ()
        return
    if k == n:
        yield tuple(range(start, start + n))
        return

    if not rev:
        yield from gray_combinations(n - 1, k, False, start)
        for x in gray_combinations(n - 1, k - 1, True, start):
            yield x + (start + n - 1,)
    else:
        for x in gray_combinations(n - 1, k - 1, False, start):
            yield x + (start + n - 1,)
        yield from gray_combinations(n - 1, k, True, start)

def solve():
    t = int(input())
    ans_all = []

    for case in range(t):
        g, n, a = map(int, input().split())
        actors = input().split()
        initial = input().split()

        initial_set = set(initial)

        if g <= a - g:
            small = initial[:]
            rest = [x for x in actors if x not in initial_set]
            order = small + rest
            k = g
            complement = False
        else:
            small = [x for x in actors if x not in initial_set]
            rest = initial[:]
            order = small + rest
            k = a - g
            complement = True

        previous = set(range(k))
        result = []
        count = 0

        for comb in gray_combinations(a, k):
            if count == 0:
                count += 1
                continue

            if count >= n:
                break

            current = set(comb)

            if complement:
                old = set(range(a)) - previous
                new = set(range(a)) - current
            else:
                old = previous
                new = current

            out_idx = next(iter(old - new))
            in_idx = next(iter(new - old))

            result.append(order[out_idx] + " " + order[in_idx])

            previous = current
            count += 1

        ans_all.append("\n".join(result))

    print("\n\n".join(ans_all))

solve()
```递归生成器是解决方案的核心。 非反向方向首先生成没有最新参与者的子集，然后以相反的顺序生成包含最新参与者的子集。 相反的方向交换这两个部分。 这种逆转是必要的，因为前半部分的最后一个子集和后半部分的第一个子集必须仅由最新的演员不同。 

补码处理是微妙的部分。 当我们生成外部演员而不是内部演员时，生成的子集描述了演员阵容中缺少的演员。 缺失场景中的一个元素变化仍然是一名演员进入或离开实际演员阵容。 

转移提取使用集合差异。 由于格雷码保证恰好有一个已更改的元素，因此两种差异都恰好包含一个参与者，因此不需要搜索或额外的验证。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n * a) | 每部制作的电影最多需要比较两个大小子集`a`|
 | 空间| O(a) | 仅存储当前格雷码状态和参与者列表 |

 最大可能的输出仅为约一万个转换，因此参与者数量的线性因子很容易在限制内。 

## 边缘情况

 当`g = 1`，该算法仍然有效，因为单元素组合格雷码只是简单地逐个遍历参与者。 过渡只是替换之前的单一演员。 

什么时候`g = a - 1`，生成缺失的演员反而避免了生成几乎整个集合的困难情况。 例如，有五个演员和四个演员，当演员阵容发生变化时，失踪的演员也会发生变化。 

当初始演员阵容包含未按排序顺序的演员时，解决方案不依赖于输入顺序。 第一个`k`重新排序列表中的演员是专门选择的，以便第一个生成的组合是给定的演员阵容。
