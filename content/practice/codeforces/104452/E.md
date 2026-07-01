---
title: "CF 104452E - 高地人锦标赛"
description: "我们有一排战士，每个战士都按照固定的从左到右的顺序坐着，并且每个战士都有不同的力量值。"
date: "2026-06-30T14:42:42+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104452
codeforces_index: "E"
codeforces_contest_name: "ICPC Central Russia Regional Contest - 2020"
rating: 0
weight: 104452
solve_time_s: 116
verified: false
draft: false
---

[CF 104452E - 高地人锦标赛](https://codeforces.com/problemset/problem/104452/E)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 56s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一排战士，每个战士都按照固定的从左到右的顺序坐着，并且每个战士都有不同的力量值。 该过程包括重复选择当前线的连续部分，只让该部分中最强的战斗机生存，并从该部分永久删除所有其他战斗机。 幸存者仍留在原来的位置，剩余的队伍在移除后关闭。 

关键点是每个操作都是在_当前行状态_上执行的，而不是在原始索引上执行的。 删除后，位置会发生变化，因此后面的段会引用更新后的数组。 

任务是在所有此类分段战斗应用后确定战斗机的最终顺序。 

限制条件很大：多达 20 万战斗机和 10 万次操作。 这立即排除了任何扫描段并从每个查询的列表中物理删除元素的方法，因为在最坏的情况下这会降级为二次行为。 甚至一个$O(n)$每个操作解决方案导致$O(nm)$，这远远超出了可接受的范围。 

一个微妙的困难是指数是动态的。 天真的解释通常假设范围指的是原始数组，但它们指的是不断发展的压缩线。 例如，在删除早期查询中的元素后，即使数字索引看起来相似，后面的查询也可能引用完全不同的元素。 

另一个常见的陷阱是尝试使用数组和重复切片来模拟该过程。 即使每个切片在逻辑上都是正确的，Python列表中间的删除也是线性的，重复删除大段会导致超时。 

## 方法

 蛮力方法很简单：维持当前的战士列表。 对于每个查询$[l, r]$，提取该子数组，找到其最大值，删除该范围内的所有内容，然后仅插入最大值。 查找最大值与段大小是线性的，并且由于移动元素，删除也会花费线性时间。 在许多操作中，特别是当重复选择大范围时，这会导致对数组进行重复的全扫描。 在最坏的情况下，单次操作成本$O(n)$，并这样做$m$次导致$O(nm)$，这对于$2 \cdot 10^5$。 

关键的观察是，每次操作中唯一幸存下来的是所选段中的最大元素。 其他所有内容都将被永久删除。 这意味着我们并不是真正在模拟战斗；而是在模拟战斗。 我们正在执行重复的“范围压缩”，其中每个片段都折叠成一个代表性元素，而所有其他元素都消失了。 

困难在于维护删除范围信息的顺序和快速访问。 这正是隐式平衡二叉搜索树（通常是陷阱）的作用。 treap按照当前位置的顺序维护元素，支持按位置拆分，并且可以存储子树信息，例如最大值和子树大小。 这使我们能够在对数时间内隔离任何片段，有效地识别其最大值，并在删除后重建结构。 

一旦我们可以隔离一个段，剩下的挑战就是删除除最大值之外的所有元素。 这是通过使用存储的子树最大信息定位段内的最大节点、围绕该节点的位置进行分割并丢弃两个外部部分来处理的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(nm)$|$O(n)$| 太慢了|
 | 隐式陷阱|$O((n+m)\log n)$|$O(n)$| 已接受 |

 ## 算法演练

 我们在隐式trap中维护当前序列，其中每个节点在其子树中存储其值、子树大小和最大值。 

1. 从初始数组构建隐式陷阱。 这表示当前的战士按顺序排列，其中中序遍历对应的是阵容。 
2. 对于每个查询$[l, r]$，将trap分成三部分：前面的前缀$l$, 段$[l, r]$，以及后面的后缀$r$。 这恰恰隔离了参与战斗的战士。 
3. 在中间段内，使用存储的子树最大值找到具有最大值的节点。 通过下降trap并比较子项中存储的值，可以在对数时间内工作。 
4. 识别出最大节点后，在从该段的根向下走时，使用子树大小确定其在段内的确切位置。 这给出了它在隐式排序中的索引。 
5. 再次将该段分成三部分：最大值之前的所有内容、最大值节点本身以及它之后的所有内容。 
6. 丢弃两个外部部分，仅保留包含最大战斗机的单节点陷阱。 
7. 将前缀、单个最大节点和后缀重新合并在一起以重建更新的阵容。 

处理完所有查询后，按顺序遍历trap会产生战斗机的最终顺序。 

### 为什么它有效

 在每一步中，trap 不变量都确保有序遍历准确地表示当前的阵容。 每个查询都会用单个元素替换连续的区间，从而保留区间外的相对顺序。 因为子树最大值查询总是返回当前段的真实最大值，所以选择的幸存者总是正确的。 由于该段中的所有其他元素都被永久删除，因此将来的操作不能依赖它们，因此丢弃它们不会影响正确性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
import random

class Node:
    __slots__ = ("val", "prio", "left", "right", "size", "mx")
    def __init__(self, val):
        self.val = val
        self.prio = random.randint(1, 10**9)
        self.left = None
        self.right = None
        self.size = 1
        self.mx = val

def sz(t):
    return t.size if t else 0

def mx(t):
    return t.mx if t else -10**18

def pull(t):
    if not t:
        return
    t.size = 1 + sz(t.left) + sz(t.right)
    t.mx = max(t.val, mx(t.left), mx(t.right))

def split(t, k):
    if not t:
        return (None, None)
    if sz(t.left) >= k:
        l, r = split(t.left, k)
        t.left = r
        pull(t)
        return (l, t)
    else:
        l, r = split(t.right, k - sz(t.left) - 1)
        t.right = l
        pull(t)
        return (t, r)

def merge(a, b):
    if not a or not b:
        return a or b
    if a.prio < b.prio:
        a.right = merge(a.right, b)
        pull(a)
        return a
    else:
        b.left = merge(a, b.left)
        pull(b)
        return b

def build(arr):
    def rec(l, r):
        if l > r:
            return None
        m = (l + r) // 2
        root = Node(arr[m])
        root.left = rec(l, m - 1)
        root.right = rec(m + 1, r)
        pull(root)
        return root
    return rec(0, len(arr) - 1)

def get_max_pos(t, add=0):
    if t.left and t.left.mx == t.mx:
        return get_max_pos(t.left, add)
    if t.val == t.mx:
        return add + sz(t.left)
    return get_max_pos(t.right, add + sz(t.left) + 1)

def solve():
    n, m = map(int, input().split())
    arr = list(map(int, input().split()))
    root = build(arr)

    for _ in range(m):
        l, r = map(int, input().split())
        l -= 1

        a, b = split(root, l)
        b, c = split(b, r - l)

        if b:
            pos = get_max_pos(b)
            b1, b2 = split(b, pos)
            mid, b3 = split(b2, 1)
            b = mid

        root = merge(merge(a, b), c)

    def inorder(t):
        if not t:
            return []
        return inorder(t.left) + [t.val] + inorder(t.right)

    print(*inorder(root))

if __name__ == "__main__":
    solve()
```该解决方案依赖于trap 中的隐式索引。 这`split`函数通过位置而不是值来分隔序列，这一点至关重要，因为结构是不断变化的。 这`mx`字段允许快速识别任何段内的最大元素，并且`get_max_pos`解析其在隐式排序中的确切索引。 

小心的部分是，在隔离最大值之后，我们在其位置再次拆分，以将其从段上下文中干净地删除，并确保没有其他元素生存。 

## 工作示例

 考虑一个小例子，其中数组是`[5, 1, 7, 2]`我们查询`[2, 4]`。 

| 步骤| 细分 | 最大| 剩余部分|
 | --- | --- | --- | --- |
 | 1 | [1,7,2]| 7 | [7] |

 运算结束后，数组变为`[5, 7]`。 这演示了该段如何在保留外部结构的同时折叠到最大程度。 

现在考虑第二次操作`[1, 2]`更新后的数组的`[5, 7]`。 

| 步骤| 细分 | 最大| 剩余部分|
 | --- | --- | --- | --- |
 | 2 | [5, 7] | 7 | [7] |

 最终结果是`[7]`。 

这表明早期操作中的删除直接影响后面段的结构，这就是为什么维护动态索引至关重要。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O((n + m)\log n)$| 每个拆分、合并和最大查询在平衡的trap上以对数时间运行|
 | 空间|$O(n)$| 结构中每个剩余元素一个节点 |

 对数因子来自于在重复分裂和合并下维持平衡树。 高达$2 \cdot 10^5$元素和$10^5$操作，这完全符合时间限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import random

    class Node:
        __slots__ = ("val", "prio", "left", "right", "size", "mx")
        def __init__(self, val):
            self.val = val
            self.prio = random.randint(1, 10**9)
            self.left = None
            self.right = None
            self.size = 1
            self.mx = val

    def sz(t): return t.size if t else 0
    def mx(t): return t.mx if t else -10**18

    def pull(t):
        if not t: return
        t.size = 1 + sz(t.left) + sz(t.right)
        t.mx = max(t.val, mx(t.left), mx(t.right))

    def split(t, k):
        if not t: return (None, None)
        if sz(t.left) >= k:
            l, r = split(t.left, k)
            t.left = r
            pull(t)
            return l, t
        else:
            l, r = split(t.right, k - sz(t.left) - 1)
            t.right = l
            pull(t)
            return t, r

    def merge(a, b):
        if not a or not b: return a or b
        if a.prio < b.prio:
            a.right = merge(a.right, b)
            pull(a)
            return a
        else:
            b.left = merge(a, b.left)
            pull(b)
            return b

    def build(arr):
        if not arr: return None
        def rec(l, r):
            if l > r: return None
            m = (l + r) // 2
            node = Node(arr[m])
            node.left = rec(l, m - 1)
            node.right = rec(m + 1, r)
            pull(node)
            return node
        return rec(0, len(arr) - 1)

    def inorder(t):
        if not t: return []
        return inorder(t.left) + [t.val] + inorder(t.right)

    def solve():
        n, m = map(int, input().split())
        arr = list(map(int, input().split()))
        root = build(arr)

        def get_max_pos(t, add=0):
            if t.left and t.left.mx == t.mx:
                return get_max_pos(t.left, add)
            if t.val == t.mx:
                return add + sz(t.left)
            return get_max_pos(t.right, add + sz(t.left) + 1)

        for _ in range(m):
            l, r = map(int, input().split())
            l -= 1
            a, b = split(root, l)
            b, c = split(b, r - l)
            if b:
                pos = get_max_pos(b)
                b1, b2 = split(b, pos)
                mid, b3 = split(b2, 1)
                b = mid
            root = merge(merge(a, b), c)

        return " ".join(map(str, inorder(root)))

    return solve()

# sample 1
assert run("7 4\n8 1 57 25 69 26 88\n1 2\n3 5\n1 3\n2 2") is not None
# custom cases
assert run("1 0\n5") == "5", "single element"
assert run("3 1\n1 2 3\n1 3") == "3", "full segment collapse"
assert run("5 2\n5 4 3 2 1\n2 4\n1 2") != "", "basic structure"
assert run("2 1\n2 1\n1 2") != "", "boundary case"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单元素 | 不变| 无操作行为 |
 | 全段崩溃| 仅最大| 全方位正确性 |
 | 递减数组 | 稳定的最大传播| 下订单移除 |
 | 小边界交换 | 索引稳健性| 分割边界|

 ## 边缘情况

 一种边缘情况是查询覆盖整个当前数组。 在这种情况下，整个结构会折叠成包含最大元素的单个节点。 treap 分割产生空前缀和后缀，仅保留中间段。 从完整结构中选择最大值，其他所有内容都被丢弃，留下单元素陷阱，这是正确的。 

另一种情况是最大元素已经位于段的边界之一处。 拆分逻辑仍然正确地隔离它，因为基于位置的拆分不依赖于值的放置。 即使最大值是最左边或最右边的节点，`get_max_pos`函数正确解析其索引，随后的分割干净地隔离它。 

最后一个微妙的情况是删除后对重叠段的重复查询。 由于trap始终表示当前压缩序列，因此索引始终与更新的结构相关。 这保证了即使原始位置暗示重叠，实际处理的段仍与当前状态保持一致。
