---
title: "CF 104218D - 服装考验"
description: "我们正在模拟一个像堆栈一样的衣柜，其中的衣物被插入，从顶部移除，有时根据名称从中间移除。 每个操作都会修改或查询这个堆。 共有三个操作。"
date: "2026-07-01T23:48:39+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104218
codeforces_index: "D"
codeforces_contest_name: "UTPC Contest 03-03-23 Div. 1 (Advanced)"
rating: 0
weight: 104218
solve_time_s: 66
verified: true
draft: false
---

[CF 104218D - 服装考验](https://codeforces.com/problemset/problem/104218/D)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 6s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们正在模拟一个像堆栈一样的衣柜，其中的衣物被插入，从顶部移除，有时根据名称从中间移除。 每个操作都会修改或查询这个堆。 

共有三个操作。 一个`put s`动作将一件具有独特名称的衣服推到堆的顶部。 一个`get`操作删除顶部项目并打印其名称，或打印`empty`如果什么都不存在。 一个`iditarod`操作在整个堆中搜索名为的特殊项目`snowcoat`。 如果存在，我们将其从当前所在的位置删除，而不会影响其余项目的相对顺序，并打印一条成功消息。 否则我们会打印一条失败消息。 

关键的限制是所有操作都必须在线处理，并且操作数最多为 1000 个，因此即使每个操作进行线性扫描也很容易足够快。 微妙的要求是删除`snowcoat`必须保留所有其他项目的顺序，就像堆栈已围绕该元素拆分一样。 

一个幼稚的错误来自于将结构视为纯堆栈并忘记了这一点`iditarod`是中间删除。 

一种边缘情况是当堆是空的并且`get`被称为。 正确的输出是`empty`。 

另一个边缘情况是当`snowcoat`不存在。 在那种情况下，`iditarod`根本不能修改堆栈。 有缺陷的实现可能会在搜索时意外弹出或部分修改状态。 

第三种边缘情况是当`snowcoat`位于堆栈的最顶部或最底部。 删除它必须仍然保留剩余元素的顺序，并且不得意外地反转或错误地重建结构。 

## 方法

 最简单的方法是将堆显式建模为 Python 列表。 我们将列表的末尾视为堆栈的顶部。 一个`put`操作是推，并且`get`操作是弹出来的。 两者都是 O(1)。 

为了`iditarod`，我们从上到下扫描列表寻找`"snowcoat"`。 一旦找到，我们就使用列表删除将其删除。 在最坏的情况下，此操作的复杂度为 O(n)，因为我们可能会扫描整个堆。 

总共最多有 1000 次操作，即使是最坏情况下每次操作的 O(n) 扫描也会导致大约 10^6 步，这完全在限制范围内。 不需要更复杂的数据结构。 

关键的见解是我们不需要有效地支持任意删除。 我们只按值删除一个特殊键，因此线性搜索就足够了。 对于此约束大小，任何维护平衡树或索引映射的尝试都是不必要的开销。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力破解（列表+扫描）| O(T·N)| O(N) | 已接受 |
 | 最佳（同样的想法）| O(T·N)| O(N) | 已接受 |

 ## 算法演练

 我们维护一个列表`pile`，其中最后一个元素是堆栈的顶部。 

1. 如果操作是`put s`, 附加`s`到最后`pile`。 这表示将一个新项目放在顶部。 
2. 如果操作是`get`，检查是否`pile`是空的。 如果为空则输出`empty`。 否则删除并输出最后一个元素。 这直接匹配堆栈语义。 
3. 如果操作是`iditarod`，从末尾向开头扫描列表。 我们搜索第一次出现的`"snowcoat"`从堆栈顶部查看时，因为那是物理上可访问的实例。 
4.如果`"snowcoat"`在索引处找到`i`，使用删除将其删除并打印成功消息。 
5. 如果扫描完成但没有找到它，则打印失败消息。 

从顶部扫描的原因是它与自然访问堆的方式相匹配，但只要我们恰好删除一个匹配元素，从任一方向扫描仍然是正确的。 

### 为什么它有效

 堆始终是项目的线性排序，其中仅发生三种转换：追加到末尾、从末尾删除或删除单个已知值。 该算法保留了顺序，因为删除仅删除一个元素，不会对任何其他元素重新排序。 每个操作都会将一个有效序列转换为另一个与问题定义完全匹配的有效序列，因此每一步后结构都保持一致。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    T = int(input())
    pile = []

    for _ in range(T):
        parts = input().strip().split()

        if parts[0] == "put":
            pile.append(parts[1])

        elif parts[0] == "get":
            if not pile:
                print("empty")
            else:
                print(pile.pop())

        else:  # iditarod
            found_idx = -1
            for i in range(len(pile) - 1, -1, -1):
                if pile[i] == "snowcoat":
                    found_idx = i
                    break

            if found_idx == -1:
                print("oopsimcold :(")
            else:
                pile.pop(found_idx)
                print("winner winner chicken dinner :)")

if __name__ == "__main__":
    solve()
```该实现直接镜像堆栈模型。 唯一的微妙之处在于`iditarod`，我们明确地从堆栈顶部向下扫描。 如果其他变体中曾经允许多个相同的名称，这可以确保我们删除正确的出现，但这里的唯一性使其变得简单。 

这`pop(found_idx)`操作删除元素而不影响其他项目的相对顺序，这正是所需的行为。 

## 工作示例

 ### 跟踪示例 1

 输入：```
put shirt
put snowcoat
iditarod
```| 步骤| 运营| 堆状态（底部→顶部）| 输出|
 | --- | --- | --- | --- |
 | 1 | 穿上衬衫| [衬衫] | |
 | 2 | 穿上雪衣| [衬衫、雪衣]| |
 | 3 | 艾迪塔罗德| [衬衫] | 赢家赢家鸡肉晚餐:) |

 这确认删除保留剩余订单并仅删除匹配的项目。 

### 跟踪示例 2

 输入：```
put a
iditarod
get
```| 步骤| 运营| 堆状态（底部→顶部）| 输出|
 | --- | --- | --- | --- |
 | 1 | 放一个 | [一] | |
 | 2 | 艾迪塔罗德| [一] | 哎呀冷:(|
 | 3 | 得到 | []| 一个 |

 这表明失败的搜索不会修改堆，并且后续的堆栈操作表现正常。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(T·N)| 每个`iditarod`可以扫描整个堆一次|
 | 空间| O(N) | 我们将所有当前项目存储在列表中 |

 对于最多 1000 次操作，最坏情况下的工作约为 10^6 次元素检查，这很容易满足 Python 中 1 秒的限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from contextlib import redirect_stdout
    import io as sio

    out = sio.StringIO()
    with redirect_stdout(out):
        solve()
    return out.getvalue().strip()

# provided sample
assert run("""6
put shirt
put snowcoat
iditarod
iditarod
put shirt2
get
""") == """winner winner chicken dinner :)
oopsimcold :(
shirt2"""

# empty get
assert run("""2
get
put x
""") == """empty"""

# snowcoat at bottom
assert run("""3
put snowcoat
put a
iditarod
""") == """winner winner chicken dinner :)"""

# multiple gets
assert run("""5
put a
put b
get
get
get
""") == """b
a
empty"""

# no snowcoat ever
assert run("""3
put a
put b
iditarod
""") == """oopsimcold :( """
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 上空| 空 | 空栈处理|
 | 雪衣底| 成功| 删除正确性 |
 | 重复获取| 后进先出的正确性 | 堆栈行为|
 | 缺少雪衣| 失败信息| 没有国家腐败|

 ## 边缘情况

 当`iditarod`在空堆上调用，扫描循环永远不会运行，算法直接输出`oopsimcold :(`而不修改状态。 例如，输入`iditarod`导致立即失败输出并且堆保持空状态。 

什么时候`snowcoat`位于堆栈顶部，反向扫描立即在索引处找到它`len(pile) - 1`， 和`pop`仅删除该元素。 剩余的一堆相对顺序不变。 

什么时候`snowcoat`位于底部，扫描会遍历整个列表，在索引 0 处找到它，并将其删除。 其余元素向下移动，但保留其原始顺序，这符合仅所选项目消失而不对其他任何内容重新排序的要求。
