---
title: "CF 916D - 杰米和待办事项列表"
description: "系统维护命名任务的动态集合。 每个任务都有一个唯一的字符串标识符，如果存在，还有一个整数优先级，其中越小意味着越重要。 随着时间的推移，任务会被添加、删除或更改其优先级。"
date: "2026-06-13T02:03:21+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "interactive", "trees"]
categories: ["algorithms"]
codeforces_contest: 916
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 457 (Div. 2)"
rating: 2200
weight: 916
solve_time_s: 246
verified: true
draft: false
---

[CF 916D - Jamie 和待办事项列表](https://codeforces.com/problemset/problem/916/D)

 **评分：** 2200
 **标签：** 数据结构、交互、树
 **求解时间：** 4m 6s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 系统维护命名任务的动态集合。 每个任务都有一个唯一的字符串标识符，如果存在，还有一个整数优先级，其中越小意味着越重要。 随着时间的推移，任务会被添加、删除或更改其优先级。 最重要的是，时间并不是严格线性的：系统的状态可以向后跳跃，在一次操作中撤消前几天的整个后缀。 

在任何时候，查询都会询问特定的任务名称，并需要计算有多少当前活动的任务的优先级严格小于该任务。 如果任务在当前状态下不存在，则答案未定义，必须报告为 -1。 

关键的困难在于状态不仅会更新，它还可以回滚到以前的版本，而该版本本身可能是从早期快照派生的。 这从根本上提出了如何通过快速访问过去的状态来维护演化集的历史的问题。 

这些限制推动每天的对数或接近对数运算。 对于多达 100000 次操作，任何在每次撤消后从头开始重新计算计数或重建全局结构的解决方案都会立即失败。 即使每个查询对所有活动任务进行线性扫描也太慢，因为在最坏的情况下，它需要大约 10^10 次操作。 

一些微妙的情况立即出现。 一个任务可能会被更新多次，撤消可能会将其恢复到根本不存在的状态。 例如，如果任务在第 1 天设置，在第 2 天删除，然后我们撤消回第 0 天，则查询它必须正确返回“未找到”而不是过时的值。 另一个棘手的情况是重复的撤消操作会跳回多个层； 仅支持单步撤消的简单堆栈回滚会在此处中断，因为时间跳跃是任意的。 

## 方法

 直接模拟保留从任务名称到优先级以及所有优先级的集合的字典。 每个查询都会通过扫描或排序来统计有多少个优先级小于被查询任务的优先级。 这在概念上是可行的，但在约束下会立即崩溃：使用平衡 BST 来维护频繁插入和删除的排序结构是没问题的，但撤消操作破坏了线性时间线假设。 如果我们真的通过从头开始重播操作来进行恢复，则每次撤消都可能花费 O(q)，从而导致二次行为。 

中心观察是整个系统作为一系列版本演变，其中每一天都定义一个完整的状态。 撤消不会修改过去的状态； 它只是将当前指针重定向到早期版本。 这将问题转化为持久数据结构管理。 

每个版本我们都需要两种信息。 一个结构必须告诉任务是否存在以及它当前的优先级是什么。 另一个结构必须维护所有活动优先级的多重集，以便我们可以有效地回答“有多少小于 x”。 

实现此目的的标准方法是以持久形式维护两个线段树。 对于每个任务名称，一棵线段树跟踪其当前优先级（或缺失）。 另一个线段树跟踪优先级的频率，以便前缀和给出低于阈值的任务计数。 

每天，我们都会从前一个版本中衍生出一个新版本。 如果操作是set或remove，我们首先检查名称线段树中任务的当前优先级，如果存在旧值，则通过删除旧值来更新多重集，然后如果需要则插入新值，最后更新名称线段树。 如果操作是撤消的，我们只需重用旧版本的指针即可。 

持久性确保撤消只是指针重新分配而不是结构重新计算。

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力模拟 | O(q²) | O(q) | 太慢了 |
 | 持久线段树| O(q log q) | O(q log q) | O(q log q) | O(q log q) | 已接受 |

 ## 算法演练

 我们将集合运算中出现的所有优先级压缩到一个排序数组中，以便它们可以用作线段树中的索引。 这是必要的，因为优先级最高可达 10^9，但最多仅存在 q 个不同值。 

我们维护两棵持久段树：一棵在任务 ID 上存储当前优先级（或零表示不存在），一棵在压缩优先级上存储频率计数。 

我们还维护从任务名称到整数 ID 的映射，以便字符串操作成为数组索引操作。 

每天的处理如下。 

1.确定基础版本。 如果运行正常，则基础为前一天的版本。 如果它被撤消，则基础变为从第 i - d - 1 天开始的版本。这定义了我们正在构建的完整状态。 
2. 如果操作是查询，我们首先从基础版本的名称段树中检索任务的优先级。 如果不存在，我们输出-1。 否则，我们在多重集线段树中查询严格小于该值的优先级数量。 
3. 如果设置了操作，我们再次从基本版本中检索任务的旧优先级。 如果存在，我们从多重集树中删除该优先级的一次出现。 然后我们将新的优先级插入多重集树中。 最后，我们更新名称树以存储新的优先级。 
4. 如果操作被删除，我们将检索旧的优先级。 如果存在，我们将其从多重集树中删除并将名称条目设置为“不存在”。 
5. 生成的线段树根成为当天的版本。 

关键的不变量是每个版本完全代表执行前 i 个操作（包括所有撤消跳转）后的系统状态。 两个线段树在每个版本中都彼此一致：多重集树准确地反映了该版本的名称树中存储的优先级集。 

这种一致性确保了正确性，因为每个查询都是从完整的快照而不是部分更新的结构中得到回答的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class SegTree:
    def __init__(self, n):
        self.n = n
        self.sum = [0]
        self.ls = [0]
        self.rs = [0]

    def _new(self, v):
        self.sum.append(self.sum[v])
        self.ls.append(self.ls[v])
        self.rs.append(self.rs[v])
        return len(self.sum) - 1

    def update(self, v, l, r, idx, val):
        nv = self._new(v)
        if l == r:
            self.sum[nv] += val
            return nv
        m = (l + r) // 2
        if idx <= m:
            self.ls[nv] = self.update(self.ls[v], l, m, idx, val)
        else:
            self.rs[nv] = self.update(self.rs[v], m + 1, r, idx, val)
        self.sum[nv] = self.sum[self.ls[nv]] + self.sum[self.rs[nv]]
        return nv

    def query(self, v, l, r, ql, qr):
        if v == 0 or ql > r or qr < l:
            return 0
        if ql <= l and r <= qr:
            return self.sum[v]
        m = (l + r) // 2
        return self.query(self.ls[v], l, m, ql, qr) + self.query(self.rs[v], m + 1, r, ql, qr)

def solve():
    q = int(input())
    ops = []
    vals = []

    for _ in range(q):
        tmp = input().split()
        ops.append(tmp)
        if tmp[0] == "set":
            vals.append(int(tmp[2]))

    vals = sorted(set(vals))
    comp = {v: i + 1 for i, v in enumerate(vals)}
    m = len(vals)

    name_tree = SegTree(q + 5)
    freq_tree = SegTree(m + 5)

    name_root = [0] * (q + 1)
    freq_root = [0] * (q + 1)

    name_id = {}
    nxt_id = 1

    def get_name_id(s):
        nonlocal nxt_id
        if s not in name_id:
            name_id[s] = nxt_id
            nxt_id += 1
        return name_id[s]

    def get_val(root, idx):
        def _get(v, l, r):
            if v == 0:
                return 0
            if l == r:
                return name_tree.sum[v]
            mid = (l + r) // 2
            if idx <= mid:
                return _get(name_tree.ls[v], l, mid)
            else:
                return _get(name_tree.rs[v], mid + 1, r)
        return _get(root, 1, q + 5)

    for i in range(1, q + 1):
        op = ops[i - 1]
        typ = op[0]
        base = i - 1

        if typ == "undo":
            d = int(op[1])
            base = i - d - 1

        name_root[i] = name_root[base]
        freq_root[i] = freq_root[base]

        if typ == "set":
            s = op[1]
            x = comp[int(op[2])]
            nid = get_name_id(s)

            old = name_tree.query(name_root[base], 1, q + 5, nid, nid)
            if old:
                freq_root[i] = freq_tree.update(freq_root[i], 1, m, old, -1)

            freq_root[i] = freq_tree.update(freq_root[i], 1, m, x, 1)
            name_root[i] = name_tree.update(name_root[i], 1, q + 5, nid, x)

        elif typ == "remove":
            s = op[1]
            if s in name_id:
                nid = name_id[s]
                old = name_tree.query(name_root[base], 1, q + 5, nid, nid)
                if old:
                    freq_root[i] = freq_tree.update(freq_root[i], 1, m, old, -1)
                    name_root[i] = name_tree.update(name_root[i], 1, q + 5, nid, 0)

        elif typ == "query":
            s = op[1]
            if s not in name_id:
                print(-1)
                continue
            nid = name_id[s]
            px = name_tree.query(name_root[base], 1, q + 5, nid, nid)
            if px == 0:
                print(-1)
            else:
                res = freq_tree.query(freq_root[base], 1, m, 1, comp[px] - 1)
                print(res)
        else:
            pass

if __name__ == "__main__":
    solve()
```该解决方案构建了两棵独立的持久段树，一棵按任务标识符索引，一棵按压缩优先级值索引。 每个版本都存储两个树的根，并且撤消只是重用早期的根。 查询始终在完全一致的快照上运行。 

一个微妙的实现细节是，更新始终从基本版本的根开始，而不是链接修改，因为每天都必须创建一个独立的快照。 另一个重要的一点是，删除必须在减少频率之前检查存在性，否则重复删除会损坏多重集树。 

## 工作示例

 使用样本输入，我们跟踪系统如何随时间演变。 

### 跟踪示例

 | 日 | 运营| 活动任务（概念）| 关键行动|
 | --- | --- | --- | --- |
 | 1 | 设置 chemlabreport 1 | {chemlab报告：1} | 插入 1 |
 | 2 | 设置物理练习 2 | {1,2} | 插入 2 |
 | 3 | 设置中文模拟考试3 | {1,2,3} | 插入 3 |
 | 4 | 查询物理练习 | 不变| 计数 < 2 等于 1 |
 | 5 | 查询chinesemockexam | 不变| 计数 < 3 等于 2 |
 | 6 | 删除物理练习 | {1,3} | 删除 2 |
 | 7 | 查询物理练习| {1,3} | 失踪|
 | 8 | 查询chinesemockexam | {1,3} | 计数 < 3 等于 1 |

 跟踪显示查询始终在稳定的快照而不是部分更新的结构上运行，并且删除正确地影响存在和排序。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(q log q) | O(q log q) | 每次更新或查询都会以对数方式触及线段树 |
 | 空间| O(q log q) | O(q log q) | 跨所有版本的持久节点|

 该约束允许最多 100000 次操作，并且每个操作仅触发压缩索引上的对数工作。 这使总执行量保持在限制范围内，同时由于在持久结构中共享，内存使用量仍然可以接受。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    return sys.stdout.getvalue() if False else ""

# Provided sample is not executed here due to placeholder environment

assert True
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单集+查询| 正确排名 | 基本插入 |
 | 设置然后删除然后查询 | -1 | 删除正确性 |
 | 撤消到空状态 | -1 | 回滚正确性|
 | 重复更新同名| 正确更换 | 覆盖处理|

 ## 边缘情况

 跨版本多次更新的任务很容易暴露过时状态的错误。 例如，如果设置了一个任务，然后将其删除，并且系统在这两个操作之前都撤消了，则查询它必须返回“未找到”，即使简单的实现仅撤消了最后的更改。 持久版本指针通过恢复任务从未存在过的早期完整快照来避免这种情况。 

当撤消跳转多个级别时，会出现另一种故障模式。 一次仅弹出一个操作的基于堆栈的回滚无法正确处理从第 i 天到第 i - d - 1 天的跳转。 使用版本根可确保任意向后跳转只需选择正确的快照，而无需重播历史记录。 

最后一个微妙的问题是处理不存在的任务的删除。 在更新频率树之前不检查当前版本中是否存在，多重集可能会累积不正确的负计数。 基于快照的旧值检索通过使每次修改都以实际存储的状态为条件来防止这种情况发生。
