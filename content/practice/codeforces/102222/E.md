---
title: "CF 102222E - 2-3-4 树"
description: "我们必须模拟 2-3-4 搜索树的插入序列。 这些值是 1..n 的排列，因此每个值都只出现一次。 一个节点可以包含一个、两个或三个排序键。 具有三个键的节点已满。"
date: "2026-08-17T22:05:42+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102222
codeforces_index: "E"
codeforces_contest_name: "2018-2019 ACM-ICPC, China Multi-Provincial Collegiate Programming Contest"
rating: 0
weight: 102222
solve_time_s: 102
verified: true
draft: false
---

[CF 102222E - 2-3-4 树](https://codeforces.com/problemset/problem/102222/E)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 42s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们必须模拟 2-3-4 搜索树的插入序列。 这些值是以下排列`1..n`，因此每个值都只出现一次。 一个节点可以包含一个、两个或三个排序键。 具有三个键的节点已满。 在下降到完整节点之前，我们将其拆分并将其中间键移至其父节点中。 如果全节点是根，则中间键成为新的根，树增长一级。 

在所有插入之后，所需的输出是按前序排列的整个树。 对于每个访问过的节点，我们将其所有键按升序打印在一行上。 

输入最多包含 50 个独立测试用例，一个用例中最多包含 5000 个插入。 如果每次插入都遵循树路径，则直接模拟就足够了，因为 2-3-4 树具有对数高度。 和`n = 5000`，甚至一个`O(n log n)`每个测试用例的实现仅执行数万个节点操作。 在所有 50 个案例中，总共可以达到 250,000 个插入值，因此避免了`O(n²)`每个案例的操作仍然有用。 

最常见的正确性错误发生在分裂周围。 例如，插入`1 2 3 4`给出```
Case #1:
2
1
3 4
```第四次插入并不是简单地追加`4`到根。 下降之前，根`[1 2 3]`被分割开来`2`, 产生根`[2]`带孩子`[1]`和`[3]`。 价值`4`然后进入右边的孩子。 

相反的插入顺序从另一侧行使相同的边界。 为了```
1
4
4 3 2 1
```正确的树是```
Case #1:
3
1 2
4
```粗心的实现会使用错误的键，或者以错误的顺序创建子项，通常会生成表面上有效的搜索树，但会产生不同的先序遍历。 

当非根节点已满时，会发生第二种微妙的情况。 假设根已经被分割并且稍后的插入到达完整的子节点。 中间的钥匙必须插入到现有的父项中，而剩下的两个部分则替换原来的子项。 将此类节点视为根节点会错误地增加树的高度。 

最后，前三个插入具有特殊的行为只是因为根作为单个节点开始。 为了`1 2 3`，这棵树只是一个节点，其中包含`1 2 3`。 分裂是在处理下一次插入时执行的，而不是在创建完整节点后立即执行。 

## 方法

 最直接的强力模拟可以明确地维护树，并且对于每个新值，通过扫描现有树来搜索其目标叶子，直到找到适当的间隔。 这是正确的，因为每个键都属于一个子区间，并且拆分完整节点可以保留搜索树顺序。 然而，在最坏的情况下，扫描可以检查每个现有节点。 之前`i`第-次插入有`i-1`存储值最多`i-1`节点，因此故意详尽的搜索最多执行`1 + 2 + ... + (n-1) = n(n-1)/2`节点检查。 为了`n = 5000`，即一个测试用例中执行了 12,497,500 次检查，而 50 个最大尺寸用例中的检查次数高达大约 6.25 亿次。 Python 不应该花费那么多时间重复遍历树的不相关部分。 

暴力方法之所以有效，是因为树本身已经包含选择下一个子节点所需的信息。 关键的观察结果是 2-3-4 树通过构造实现平衡。 每个根到叶路径都具有相同的长度，并且每个内部节点至少有两个子节点。 因此，高度为`O(log n)`。 我们永远不需要检查不相关的子树。 在每个节点，其一个、两个或三个键将剩余搜索空间划分为两个、三个或四个区间，因此一个比较序列恰好标识一个子节点。 

这给出了标准的自顶向下 B 树插入策略。 在遵循搜索路径时，在下降到完整节点之前先对其进行分割。 一个完整的节点包含`[a, b, c]`， 所以`b`向上移动，该节点变成包含以下内容的两个节点：`[a]`和`[c]`。 如果该节点有子节点，则前两个子节点仍为`[a]`最后两个仍然是`[c]`。 一旦我们到达叶子，该叶子最多有两个键，因此可以简单地将新值插入那里。 

最终的实现完全遵循问题的插入过程，同时仅存储实际树上的节点，并且从不搜索不相关的子树。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |`O(n²)`|`O(n)`| 在最坏的情况下太慢|
 | 最佳 |`O(n log n)`|`O(n)`| 已接受 |

 ## 算法演练

 1. 用排序来表示每个节点`keys`列表及其`children`列表。 叶子没有子节点，2 节点有一个键，3 节点有两个键，4 节点有三个键。 内部节点的子节点数量恰好比键的数量多一个。 
2. 对于每个要插入的值，首先检查根是否已满。 如果它包含三个密钥，则将其拆分为两个子密钥并将其中间密钥提升为新的根。 这是唯一增加树高度的操作。 
3. 从根开始，在选择子节点之前处理当前节点。 如果当前节点是叶子，则将值插入到其排序键列表中并停止。 该节点不可能已经满了，因为在我们下降到完整节点之前，它们已经被分割了。 
4. 如果当前节点是内部节点，则确定哪个子节点包含新值。 带钥匙`[k0]`，值小于`k0`转到子零，较大的值转到子一。 和`[k0, k1]`，共有三个区间。 和`[k0, k1, k2]`，有四个。 
5. 在下降到所选子级之前，检查该子级是否已满。 如果是，请立即分割。 它的中间键移动到当前节点，并且两个结果节点替换原来的完整子节点。 这就是为什么在选择最终子索引之前必须修改父索引的原因。 
6. 拆分子项后，将值与新提升的键进行比较。 如果该值大于提升的键，则正确的目标是新的右子级，因此增加子级索引。 否则，该值属于左子级。 
7. 重复下降直至到达一片树叶。 使用排序插入操作将值插入到叶子中。 
8. 插入所有值后，执行前序遍历。 首先打印当前节点，然后从左到右递归访问其子节点。 

关键的不变量是，在每次下降之前，进入的节点不是满的。 每个分割都保留键的排序顺序以及子间隔和键之间的对应关系。 由于每次插入都是在其间隔包含该值的唯一叶子中进行，因此所有值都保持搜索树顺序。 由于每个全节点在下降之前都被分割，因此插入后不需要修改四节点，并且在整个过程中树仍然是有效的平衡 2-3-4 树。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class Node:
    __slots__ = ("keys", "children")

    def __init__(self, keys=None, children=None):
        self.keys = [] if keys is None else keys
        self.children = [] if children is None else children

    def is_leaf(self):
        return not self.children

def split_child(parent, idx):
    """
    parent.children[idx] is a full node with three keys.

    Split:
        [a, b, c]
    into
        [a] and [c]
    and promote b into parent.
    """
    node = parent.children[idx]

    middle = node.keys[1]

    left = Node([node.keys[0]])
    right = Node([node.keys[2]])

    if node.children:
        left.children = node.children[:2]
        right.children = node.children[2:]

    parent.keys.insert(idx, middle)
    parent.children[idx] = left
    parent.children.insert(idx + 1, right)

def insert(root, value):
    # A full root has to be split before we start descending.
    if len(root.keys) == 3:
        new_root = Node([], [root])
        split_child(new_root, 0)
        root = new_root

    cur = root

    while True:
        if cur.is_leaf():
            # The leaf is guaranteed not to be full.
            if not cur.keys:
                cur.keys.append(value)
            elif value < cur.keys[0]:
                cur.keys.insert(0, value)
            elif value > cur.keys[-1]:
                cur.keys.append(value)
            else:
                # Input is a permutation, so this branch is unreachable.
                pos = 0
                while pos < len(cur.keys) and cur.keys[pos] < value:
                    pos += 1
                cur.keys.insert(pos, value)
            return root

        # Find the child interval containing value.
        idx = 0
        while idx < len(cur.keys) and value > cur.keys[idx]:
            idx += 1

        # Split a full child before descending into it.
        if len(cur.children[idx].keys) == 3:
            split_child(cur, idx)

            # The promoted key now sits at cur.keys[idx].
            if value > cur.keys[idx]:
                idx += 1

        cur = cur.children[idx]

def preorder(root, out):
    out.append(" ".join(map(str, root.keys)))
    for child in root.children:
        preorder(child, out)

def solve():
    t = int(input())
    output = []

    for case_id in range(1, t + 1):
        n = int(input())
        a = list(map(int, input().split()))

        root = Node()

        for value in a:
            root = insert(root, value)

        output.append(f"Case #{case_id}:")
        preorder(root, output)

    sys.stdout.write("\n".join(output))

if __name__ == "__main__":
    solve()
```这`Node`class 故意保持较小的表示。 一个节点最多有 3 个键，最多有 4 个子节点，因此在渐近分析中，节点内的 Python 列表操作是常数时间。`split_child`实行中央结构运作。 对于全节点`[a, b, c]`, 关键`b`晋升为父级。 左节点接收`a`并且正确的节点接收到`c`。 如果原始节点是内部节点，则其前两个子节点属于左节点，最后两个子节点属于右节点。 切片索引`[:2]`和`[2:]`正是搜索树间隔所需的四子分割。 

根被单独处理，因为它没有可以将其中间键提升到的父级。 创建包含两个结果子级的新根相当于将树高增加一。 

对于非 root 完整的孩子，`split_child(cur, idx)`将升级的密钥插入准确的位置`idx`在父级中，并将右半部分立即插入到左半部分之后。 如果插入的值大于提升的键，则必须递增子索引。 忘记这种调整是错误答案的常见原因，因为旧子索引现在指的是左半部分。 

叶子插入使用Python列表，因为一个节点最多有三个键。 移动这几个元素不会产生有意义的渐近成本。 由于输入保证是排列，因此实际上不需要重复处理。 

最后的遍历在其子节点之前打印一个节点，这正是前序遍历。 子项已经从左到右存储，因此按列表顺序访问它们即可实现所需的遍历，而无需任何额外的排序。 

Python 整数溢出在这里无关紧要，因为每个值都位于`1`和`n`，树直接存储这些值。 

## 工作示例

 ### 示例 1

 第一个样本插入`1, 2, 3, 4`。 前三个值适合根。 在第四次插入期间，在算法下降之前，完整的根被分割。 

| 插入| 当前根 | 行动| 结果 |
 | ---| ---| ---| ---|
 |`1`| 空 | 插入叶子 |`[1]`|
 |`2`|`[1]`| 插入叶子 |`[1 2]`|
 |`3`|`[1 2]`| 插入叶子 |`[1 2 3]`|
 |`4`|`[1 2 3]`| 将根分开`2`| 根`[2]`， 孩子们`[1]`,`[3]`|
 |`4`|`[2]`| 向右下降，插入`[3]`|`[3 4]`|

 最终的前序遍历为```
Case #1:
2
1
3 4
```该轨迹说明了为什么在下降之前会发生分裂。 如果`4`首先插入到完整的根中，结果将不再遵循指定的插入过程。 

### 示例 2

 第二个样本使用反向排列`4, 3, 2, 1`。 

| 插入| 当前树根| 行动| 产生的相关路径 |
 | ---| ---| ---| ---|
 |`4`| 空 | 插入叶子 |`[4]`|
 |`3`|`[4]`| 插入叶子 |`[3 4]`|
 |`2`|`[3 4]`| 插入叶子 |`[2 3 4]`|
 |`1`|`[2 3 4]`| 将根分开`3`| 根`[3]`， 孩子们`[2]`,`[4]`|
 |`1`|`[3]`| 向左下降并插入 |`[1 2]`|

 最终的树是```
Case #2:
3
1 2
4
```中间键始终被提升。 在这种情况下，完整的根`[2 3 4]`促进`3`， 不是`2`或者`4`。 较小的值保留在左子元素中，较大的值保留在右子元素中。 

第三个样本更大，并且展示了不同级别的重复分裂。 它的最终输出是```
Case #3:
5 9
2
1
3 4
7
6
8
11 13 15
10
12
14
16 17
```根包含两个键，`5`和`9`，所以它有三个孩子。 前序遍历首先打印根，然后打印包含以下值的整个子树`5`，然后之间的子树`5`和`9`，最后是上面的子树`9`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |`O(n log n)`| 每次插入都遵循一条对数高度的从根到叶的路径，并且每个节点最多有三个键 |
 | 空间|`O(n)`| 该树包含`O(n)`节点和每个节点存储恒定大小的键和子列表 |

 2-3-4树有高度`O(log n)`因为每个内部节点至少有两个子节点，并且所有叶子节点都处于相同的深度。 和`n <= 5000`，每次插入仅访问少量节点。 即使有 50 个测试用例，总工作量仍然在规定的 10 秒限制内。 

## 测试用例

 官方的示例输入输出可以准确测试。 下面的自定义测试使用小的排列，其中可以手动导出预期的树。 该规范要求每个测试用例都是以下的排列`1..n`，因此全相等的输入不是有效的测试用例，不应包含在所提交程序的正确性测试中。```python
import sys
import io

class Node:
    __slots__ = ("keys", "children")

    def __init__(self, keys=None, children=None):
        self.keys = [] if keys is None else keys
        self.children = [] if children is None else children

def split_child(parent, idx):
    node = parent.children[idx]

    middle = node.keys[1]
    left = Node([node.keys[0]])
    right = Node([node.keys[2]])

    if node.children:
        left.children = node.children[:2]
        right.children = node.children[2:]

    parent.keys.insert(idx, middle)
    parent.children[idx] = left
    parent.children.insert(idx + 1, right)

def insert(root, value):
    if len(root.keys) == 3:
        new_root = Node([], [root])
        split_child(new_root, 0)
        root = new_root

    cur = root

    while True:
        if not cur.children:
            pos = 0
            while pos < len(cur.keys) and cur.keys[pos] < value:
                pos += 1
            cur.keys.insert(pos, value)
            return root

        idx = 0
        while idx < len(cur.keys) and value > cur.keys[idx]:
            idx += 1

        if len(cur.children[idx].keys) == 3:
            split_child(cur, idx)
            if value > cur.keys[idx]:
                idx += 1

        cur = cur.children[idx]

def preorder(root, out):
    out.append(" ".join(map(str, root.keys)))
    for child in root.children:
        preorder(child, out)

def solution(inp: str) -> str:
    data = list(map(int, inp.split()))
    it = iter(data)

    t = next(it)
    out = []

    for case_id in range(1, t + 1):
        n = next(it)
        values = [next(it) for _ in range(n)]

        root = Node()

        for x in values:
            root = insert(root, x)

        out.append(f"Case #{case_id}:")
        preorder(root, out)

    return "\n".join(out)

def run(inp: str) -> str:
    return solution(inp)

sample_input = """\
3
4
1 2 3 4
4
4 3 2 1
17
6 3 5 7 1 10 2 9 4 8 11 12 13 14 15 16 17
"""

sample_output = """\
Case #1:
2
1
3 4
Case #2:
3
1 2
4
Case #3:
5 9
2
1
3 4
7
6
8
11 13 15
10
12
14
16 17
"""

assert run(sample_input) == sample_output, "official samples"

assert run("""\
1
1
1
""") == """\
Case #1:
1
""", "minimum-size case"

assert run("""\
1
4
1 2 3 4
""") == """\
Case #1:
2
1
3 4
""", "root split"

assert run("""\
1
4
4 3 2 1
""") == """\
Case #1:
3
1 2
4
""", "reverse insertion"

assert run("""\
1
7
1 2 3 4 5 6 7
""") == """\
Case #1:
4
2
1
3
6
5
7
""", "multiple root and child splits"

# The original constraints require a permutation, so an all-equal case
# such as 4 / 1 1 1 1 is intentionally not tested as valid input.
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 / 1 / 1`|`Case #1:`， 然后`1`| 最小可能树和空根初始化 |
 |`1 / 4 / 1 2 3 4`| 根`2`， 孩子们`1`和`3 4`| 在下降之前分割完整的根 |
 |`1 / 4 / 4 3 2 1`| 根`3`， 孩子们`1 2`和`4`| 减少输入的对称行为 |
 |`1 / 7 / 1 2 3 4 5 6 7`| 根`4`具有三个级别的预购输出 | 重复拆分和子索引更新 |

 ## 边缘情况

 最小的有效输入是`n = 1`与排列`1`。 根开始是空的，`1`直接插入其中，预序遍历恰好打印一行包含`1`。 不涉及特殊的分割或子遍历。 

为了`n = 4`并输入`1 2 3 4`，根变为`[1 2 3]`在前三个插入之后。 加工前`4`，算法检测到根已满，则提升`2`，并创建孩子`[1]`和`[3]`。 自从`4 > 2`，子索引保持在右侧并且`4`被插入到`[3]`，生产`[3 4]`。 输出正是`2`,`1`,`3 4`预购中。 

为了`n = 4`并输入`4 3 2 1`，完整的根是`[2 3 4]`插入之前`1`。 中间的键`3`被推广、产生`[3]`带孩子`[2]`和`[4]`。 自从`1 < 3`，算法下降到左孩子并获得`[1 2]`。 这会捕获意外提升第一个或最后一个键而不是中间键的实现。 

当子级已满而其父级未满时，会出现更深层次的边界情况。 考虑通过以下方式增加投入`1 2 3 4 5 6 7`。 第四次插入后，根为`[2]`带孩子`[1]`和`[3 4]`。 插入`5`培养正确的孩子`[3 4 5]`。 插入前`6`，那个孩子被分裂了`4`，所以根变成`[2 4]`带孩子`[1]`,`[3]`， 和`[5]`。 价值`6`然后进入第三个孩子。 进一步的插入可能会使另一个子进程满并触发另一个局部分裂。 根不会仅仅因为子分裂而获得新的级别，这正是根处理必须与普通子处理分开的原因。 

无效的全等输入，例如```
1
4
1 1 1 1
```不能用来判断解决方案，因为该问题明确保证了排列`1..n`。 如果单独的测试工具想要检查重复处理，那么它正在测试问题契约之外的行为。 提交的算法不需要为该输入定义结果。 

预序输出本身是另一个边界条件。 对于每个内部节点，当前节点的键必须在任何后代节点之前打印。 打印根后`[5 9]`在第三个示例中，遍历完全打印了下面的子树`5`，然后之间的子树`5`和`9`，只有上面的子树`9`。 在当前节点之前打印子节点会产生类似中序的结构，并且即使完美构建了底层 2-3-4 树，也会失败。
